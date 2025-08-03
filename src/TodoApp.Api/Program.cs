using TodoApp.Api.Features.HealthCheck;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddHealthChecks();

// Add OpenAPI/Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "TodoApp API",
        Version = "v1",
        Description = "Multi-tenant todo application API"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TodoApp API v1");
        options.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
}

app.MapHealthCheckEndpoints();

app.Run();

// Make the implicit Program class public so test projects can access it
public partial class Program { }