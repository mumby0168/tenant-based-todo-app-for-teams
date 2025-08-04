using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Features.TodoLists.DTOs;
using TodoApp.Api.Features.Auth.Services;

namespace TodoApp.Api.Features.TodoLists;

public static class TodoListEndpoints
{
    public static WebApplication MapTodoListEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/lists")
            .WithTags("Todo Lists")
            .WithOpenApi()
            .RequireAuthorization();

        group.MapGet("/", GetTodoLists)
            .WithName("GetTodoLists")
            .WithSummary("Get all todo lists for the current team")
            .Produces<GetTodoListsResponse>(StatusCodes.Status200OK)
            .Produces<ProblemDetails>(StatusCodes.Status401Unauthorized);

        return app;
    }

    private static async Task<IResult> GetTodoLists(
        [FromServices] TodoAppDbContext db,
        [FromServices] IJwtService jwtService,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        // Get current team from JWT claims  
        var teamIdClaim = httpContext.User.FindFirst("current_team_id")?.Value 
                         ?? httpContext.User.FindFirst("team_id")?.Value; // Fallback for tests
        if (teamIdClaim == null || !Guid.TryParse(teamIdClaim, out var teamId))
        {
            return Results.Unauthorized();
        }

        // Get todo lists for the current team, excluding deleted ones
        var todoLists = await db.TodoLists
            .Where(tl => tl.TeamId == teamId && !tl.IsDeleted)
            .OrderByDescending(tl => tl.CreatedAt)
            .Select(tl => new TodoListDto(
                tl.Id,
                tl.Name,
                tl.Description,
                tl.Color,
                tl.CreatedAt,
                tl.UpdatedAt,
                0 // TodoCount will be implemented later
            ))
            .ToListAsync(cancellationToken);

        return Results.Ok(new GetTodoListsResponse(todoLists));
    }
}