using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Api.Data;
using TodoApp.Api.Features.Auth;
using TodoApp.Api.Features.Auth.Repositories;
using TodoApp.Api.Features.Auth.Services;
using TodoApp.Api.Features.Auth.Validators;
using TodoApp.Api.Features.HealthCheck;
using TodoApp.Api.Features.TodoLists;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddHealthChecks();

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<RequestCodeRequestValidator>();

// Add Entity Framework Core with PostgreSQL
builder.Services.AddDbContext<TodoAppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Authentication & Authorization
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(EmailOptions.SectionName));
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IVerificationTokenRepository, VerificationTokenRepository>();

var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() 
    ?? throw new InvalidOperationException("JWT configuration is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWeb", policy =>
    {
        policy.WithOrigins("http://localhost:5180", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

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

app.UseCors("AllowWeb");

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthCheckEndpoints();
app.MapAuthEndpoints();
app.MapTodoListEndpoints();

app.Run();

// Make the implicit Program class public so test projects can access it
public partial class Program { }