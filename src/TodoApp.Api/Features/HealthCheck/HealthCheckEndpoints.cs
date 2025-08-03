using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;

namespace TodoApp.Api.Features.HealthCheck;

public static class HealthCheckEndpoints
{
    public static WebApplication MapHealthCheckEndpoints(this WebApplication app)
    {
        app.MapHealthChecks("/health", new HealthCheckOptions
        {
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";

                var response = new
                {
                    status = report.Status.ToString(),
                    timestamp = DateTimeOffset.UtcNow,
                    service = "TodoApp.Api"
                };

                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                });

                await context.Response.WriteAsync(json);
            }
        });

        return app;
    }
}