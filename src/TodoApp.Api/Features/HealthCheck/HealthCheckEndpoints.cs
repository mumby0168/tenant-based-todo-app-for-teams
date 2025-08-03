namespace TodoApp.Api.Features.HealthCheck;

public static class HealthCheckEndpoints
{
    public static WebApplication MapHealthCheckEndpoints(this WebApplication app)
    {
        app.MapGet("/health", GetHealth)
            .WithName("GetHealth")
            .WithSummary("Get the health status of the API")
            .WithDescription("Returns the current health status of the TodoApp API service")
            .WithTags("Health")
            .Produces<HealthCheckResponse>(StatusCodes.Status200OK);

        return app;
    }

    private static IResult GetHealth()
    {
        var response = new HealthCheckResponse(
            Status: "Healthy",
            Timestamp: DateTimeOffset.UtcNow,
            Service: "TodoApp.Api"
        );

        return Results.Ok(response);
    }
}

public record HealthCheckResponse(
    string Status,
    DateTimeOffset Timestamp,
    string Service
);