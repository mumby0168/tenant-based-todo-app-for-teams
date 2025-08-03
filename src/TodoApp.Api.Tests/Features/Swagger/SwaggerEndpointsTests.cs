using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;

namespace TodoApp.Api.Tests.Features.Swagger;

public class SwaggerEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public SwaggerEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Get_SwaggerUI_ReturnsSuccessStatusCode()
    {
        // Arrange
        const string endpoint = "/";

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
    public async Task Get_SwaggerUI_ReturnsHtmlContent()
    {
        // Arrange
        const string endpoint = "/";

        // Act
        var response = await _client.GetAsync(endpoint);
        var content = await response.Content.ReadAsStringAsync();

        // Assert
        using (new AssertionScope())
        {
            response.Content.Headers.ContentType?.MediaType.Should().Be("text/html");
            content.Should().NotBeNullOrWhiteSpace();
            content.Should().Contain("swagger-ui");
            content.Should().Contain("Swagger UI");
        }
    }

    [Fact]
    public async Task Get_SwaggerJson_ReturnsSuccessStatusCode()
    {
        // Arrange
        const string endpoint = "/swagger/v1/swagger.json";

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
    public async Task Get_SwaggerJson_ReturnsValidOpenApiDocument()
    {
        // Arrange
        const string endpoint = "/swagger/v1/swagger.json";

        // Act
        var response = await _client.GetAsync(endpoint);
        var content = await response.Content.ReadAsStringAsync();

        // Assert
        using (new AssertionScope())
        {
            response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");
            content.Should().NotBeNullOrWhiteSpace();
            content.Should().Contain("\"openapi\":");
            content.Should().Contain("\"info\":");
            content.Should().Contain("TodoApp API");
            content.Should().Contain("v1");
            content.Should().Contain("Multi-tenant todo application API");
            content.Should().Contain("/health");
        }
    }
}