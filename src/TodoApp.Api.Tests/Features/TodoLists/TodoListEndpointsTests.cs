using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TodoApp.Api.Data.Models;
using TodoApp.Api.Features.TodoLists.DTOs;
using TodoApp.Api.Tests.Common;

namespace TodoApp.Api.Tests.Features.TodoLists;

public class TodoListEndpointsTests(IntegrationTestFactory factory) : IntegrationTestBase(factory)
{
    private const string GetTodoListsEndpoint = "/api/v1/lists";    

    [Fact]
    public async Task GetTodoLists_WhenNoListsExist_ShouldReturnEmptyList()
    {
        // Arrange
        var authResponse = await RegisterNewUserAsync();
        var authenticatedClient = CreateAuthenticatedClient(authResponse);

        // Act
        var response = await authenticatedClient.GetAsync(GetTodoListsEndpoint);

        // Assert
        using (new AssertionScope())
        {
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            var content = await response.Content.ReadFromJsonAsync<GetTodoListsResponse>();
            content.Should().NotBeNull();
            content!.TodoLists.Should().BeEmpty();
        }
    }

    [Fact]
    public async Task GetTodoLists_WhenListsExist_ShouldReturnTeamListsOnly()
    {
        // Arrange
        var team1AuthResponse = await RegisterNewUserAsync();
        var team2AuthResponse = await RegisterNewUserAsync();
        
        // Get team IDs from auth responses
        var team1Id = team1AuthResponse.Team.Id;
        var team2Id = team2AuthResponse.Team.Id;
        
        
        // Create lists for team 1
        var team1Lists = new List<TodoList>
        {
            new() { Id = Guid.NewGuid(), Name = "Team 1 List 1", TeamId = team1Id, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow },
            new() { Id = Guid.NewGuid(), Name = "Team 1 List 2", TeamId = team1Id, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow }
        };
        
        // Create lists for team 2
        var team2Lists = new List<TodoList>
        {
            new() { Id = Guid.NewGuid(), Name = "Team 2 List 1", TeamId = team2Id, CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow }
        };

        // Create deleted list for team 1 (should not be returned)
        var deletedList = new TodoList 
        { 
            Id = Guid.NewGuid(), 
            Name = "Deleted List", 
            TeamId = team1Id, 
            IsDeleted = true, 
            DeletedAt = DateTimeOffset.UtcNow,
            CreatedAt = DateTimeOffset.UtcNow, 
            UpdatedAt = DateTimeOffset.UtcNow 
        };

        // Add lists to database
        await UseDbAsync(async db =>
        {
            db.TodoLists.AddRange(team1Lists);
            db.TodoLists.AddRange(team2Lists);
            db.TodoLists.Add(deletedList);
            await db.SaveChangesAsync();
        });

        // Act - Get lists for team 1
        var team1Client = CreateAuthenticatedClient(team1AuthResponse);
        var response = await team1Client.GetAsync(GetTodoListsEndpoint);

        // Assert
        using (new AssertionScope())
        {
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            var content = await response.Content.ReadFromJsonAsync<GetTodoListsResponse>();
            content.Should().NotBeNull();
            content!.TodoLists.Should().HaveCount(2, "should only return team 1's non-deleted lists");
            var team1ListIds = team1Lists.Select(tl => tl.Id).ToList();
            content.TodoLists.Should().AllSatisfy(list => 
            {
                team1ListIds.Should().Contain(list.Id);
                list.Name.Should().StartWith("Team 1");
            });
            
            // Verify lists are ordered by CreatedAt descending (most recent first)
            content.TodoLists.Should().BeInDescendingOrder(list => list.CreatedAt);
        }
    }

    [Fact]
    public async Task GetTodoLists_ShouldReturnCorrectListProperties()
    {
        // Arrange
        var authResponse = await RegisterNewUserAsync();
        var teamId = authResponse.Team.Id;
        var testList = new TodoList
        {
            Id = Guid.NewGuid(),
            Name = "Test List",
            Description = "Test Description",
            Color = "#FF5722",
            TeamId = teamId,
            CreatedAt = DateTimeOffset.UtcNow.AddHours(-1),
            UpdatedAt = DateTimeOffset.UtcNow
        };

        await UseDbAsync(async db =>
        {
            db.TodoLists.Add(testList);
            await db.SaveChangesAsync();
        });

        // Act
        var authenticatedClient = CreateAuthenticatedClient(authResponse);
        var response = await authenticatedClient.GetAsync(GetTodoListsEndpoint);

        // Assert
        using (new AssertionScope())
        {
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            var content = await response.Content.ReadFromJsonAsync<GetTodoListsResponse>();
            content.Should().NotBeNull();
            content!.TodoLists.Should().HaveCount(1);
            
            var returnedList = content.TodoLists.First();
            returnedList.Id.Should().Be(testList.Id);
            returnedList.Name.Should().Be(testList.Name);
            returnedList.Description.Should().Be(testList.Description);
            returnedList.Color.Should().Be(testList.Color);
            returnedList.CreatedAt.Should().BeCloseTo(testList.CreatedAt, TimeSpan.FromSeconds(1));
            returnedList.UpdatedAt.Should().BeCloseTo(testList.UpdatedAt, TimeSpan.FromSeconds(1));
            returnedList.TodoCount.Should().Be(0, "todo count not implemented yet");
        }
    }
}