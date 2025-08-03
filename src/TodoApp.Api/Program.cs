using TodoApp.Api.Features.HealthCheck;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline
app.MapHealthCheckEndpoints();

app.Run();

// Make the implicit Program class public so test projects can access it
public partial class Program { }