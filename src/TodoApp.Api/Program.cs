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

var builder = WebApplication.CreateBuilder(args);

// Add Aspire service defaults - provides telemetry, health checks, service discovery
builder.AddServiceDefaults();

// Add PostgreSQL with Aspire integration (connection string automatically injected)
builder.AddNpgsqlDbContext<TodoAppDbContext>("todoapp-db", configureDbContextOptions: options =>
{
    // Move snake case naming from OnConfiguring to here (required for DbContext pooling)
    options.UseSnakeCaseNamingConvention();
});

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<RequestCodeRequestValidator>();

// Add Authentication & Authorization  
builder.Services.Configure<EmailOptions>(options =>
{
    // Configure email options with Aspire service discovery
    builder.Configuration.GetSection(EmailOptions.SectionName).Bind(options);
    
    // Override with Aspire-provided MailDev SMTP endpoint if available
    var maildevSmtp = builder.Configuration["services:maildev:smtp:0"];
    if (!string.IsNullOrEmpty(maildevSmtp))
    {
        var uri = new Uri(maildevSmtp);
        options.SmtpHost = uri.Host;
        options.SmtpPort = uri.Port;
    }
});
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

// Apply database migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoAppDbContext>();
    context.Database.Migrate();
}

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

// Map Aspire service defaults endpoints (health checks, etc.)
app.MapDefaultEndpoints();

app.MapHealthCheckEndpoints();
app.MapAuthEndpoints();

app.Run();

// Make the implicit Program class public so test projects can access it
public partial class Program { }