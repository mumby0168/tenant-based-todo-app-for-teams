using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text.Json;

namespace TodoApp.Api.Tests.Features.HealthCheck;

public class HealthCheckEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public HealthCheckEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Get_Health_ReturnsSuccessStatusCode()
    {
        // Arrange
        const string endpoint = "/health";

        // Act
        var response = await _client.GetAsync(endpoint);

        // Assert
        using (new AssertionScope())
        {
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.IsSuccessStatusCode.Should().BeTrue();
        }
    }

    [Fact]
    public async Task Get_Health_ReturnsExpectedJsonContent()
    {
        // Arrange
        const string endpoint = "/health";

        // Act
        var response = await _client.GetAsync(endpoint);
        var content = await response.Content.ReadAsStringAsync();
        
        // Assert
        using (new AssertionScope())
        {
            content.Should().NotBeNullOrWhiteSpace();
            content.Should().Contain("\"status\":");
            content.Should().Contain("\"timestamp\":");
            content.Should().Contain("\"service\":");
            content.Should().Contain("\"TodoApp.Api\"");
        }
    }

    [Fact]
    public async Task Get_Health_ReturnsHealthyStatus()
    {
        // Arrange
        const string endpoint = "/health";
        const string expectedStatus = "Healthy";

        // Act
        var response = await _client.GetAsync(endpoint);
        var content = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(content);
        var status = jsonDoc.RootElement.GetProperty("status").GetString();
        
        // Assert
        status.Should().Be(expectedStatus);
    }

    [Fact]
    public async Task Get_Health_ReturnsValidJsonStructure()
    {
        // Arrange
        const string endpoint = "/health";

        // Act
        var response = await _client.GetAsync(endpoint);
        var content = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(content);
        var root = jsonDoc.RootElement;
        
        // Assert
        using (new AssertionScope())
        {
            root.TryGetProperty("status", out _).Should().BeTrue("status property should exist");
            root.TryGetProperty("timestamp", out _).Should().BeTrue("timestamp property should exist");
            root.TryGetProperty("service", out _).Should().BeTrue("service property should exist");
            
            root.GetProperty("service").GetString().Should().Be("TodoApp.Api");
            root.GetProperty("timestamp").GetDateTimeOffset().Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromSeconds(5));
        }
    }
}