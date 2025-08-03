# Backend Patterns Guide - .NET/C# API

## Quick Start Commands
```bash
# Create new Web API project
dotnet new web -n MyApp.Api
cd MyApp.Api

# Add required packages
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.OpenApi
dotnet add package Swashbuckle.AspNetCore
dotnet add package FluentValidation.AspNetCore

# Add for development
dotnet add package Microsoft.EntityFrameworkCore.InMemory

# Create initial migration
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Tech Stack
- **.NET 8** with Minimal APIs
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** with multi-organization support
- **OpenTelemetry** for observability
- **Docker** for containerization

## Project Structure
```
src/
├── Features/               # Feature-based organization
│   ├── Authentication/
│   │   ├── AuthenticationApiEndpoints.cs
│   │   ├── Constants/
│   │   ├── Services/
│   │   └── Extensions/
│   ├── User/
│   │   ├── UserManagementEndpoints.cs
│   │   ├── Contracts/
│   │   ├── Services/
│   │   └── Extensions/
│   └── [Other Features]/
├── Data/
│   ├── Models/
│   ├── Migrations/
│   └── KelliBookContext.cs
├── ServiceDefaults/
│   ├── Extensions/
│   └── Options/
└── Program.cs
```

## Core Patterns

### 1. Minimal API Endpoints Pattern
```csharp
public static class UserManagementEndpoints
{
    public static WebApplication MapUserManagementEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/v1/users")
            .WithTags("User Management");

        group.MapGet("/", GetUsers)
            .WithName("GetUsers")
            .WithSummary("Get all users")
            .Produces<GetUsersResponse>(StatusCodes.Status200OK)
            .RequireAuthorization(nameof(Roles.Administrator));

        group.MapPost("/", CreateUser)
            .RequireAuthorization(nameof(Roles.Administrator));

        return app;
    }

    private static async Task<IResult> GetUsers(
        [FromServices] IUserService service,
        [FromServices] IUserProvider userProvider,
        CancellationToken cancellationToken)
    {
        var activity = Activity.Current?.UpdateName("GET /api/v1/users");
        
        try
        {
            var orgId = userProvider.CurrentOrganisationId;
            var response = await service.GetUsersAsync(orgId, cancellationToken);
            return TypedResults.Ok(response);
        }
        catch (Exception e)
        {
            activity?.RecordExceptionWithErrorStatus(e);
            return TypedResults.InternalServerError();
        }
    }
}
```

### 2. Service Layer Pattern
```csharp
public interface IUserService
{
    Task<GetUsersResponse> GetUsersAsync(Guid orgId, CancellationToken ct = default);
    Task<User> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default);
}

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    
    public UserService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<GetUsersResponse> GetUsersAsync(Guid orgId, CancellationToken ct)
    {
        var users = await _context.Users
            .Include(u => u.Roles)
            .Where(u => u.OrganisationId == orgId)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Roles = u.Roles.Select(r => r.Name).ToList()
            })
            .ToListAsync(ct);
            
        return new GetUsersResponse(users);
    }
}
```

### 3. Entity Framework Configuration
```csharp
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Organisation> Organisations { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(u => u.Email).IsUnique();
            
            entity.HasOne(u => u.Organisation)
                .WithMany(o => o.Users)
                .HasForeignKey(u => u.OrganisationId);
        });
        
        // Seed data for development
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            modelBuilder.SeedDevelopmentData();
        }
    }
}
```

### 4. Dependency Injection Pattern
```csharp
// Feature registration via extension methods
public static class UserFeatureExtensions
{
    public static IHostApplicationBuilder AddUserFeature(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IUserProvider, UserProvider>();
        
        return builder;
    }
}

// In Program.cs
var builder = WebApplication.CreateBuilder(args);

builder
    .AddServiceDefaults()
    .AddDatabase()
    .AddAuthenticationFeature()
    .AddUserFeature();

var app = builder.Build();

app
    .UseServiceDefaults()
    .UseAuthentication()
    .UseAuthorization()
    .MapUserManagementEndpoints();
```

### 5. Authentication & Authorization
```csharp
// JWT Service
public interface IJwtService
{
    string GenerateToken(User user, Organisation org);
    ClaimsPrincipal? ValidateToken(string token);
}

// User Provider for current context
public interface IUserProvider
{
    Guid Id { get; }
    Guid CurrentOrganisationId { get; }
    IEnumerable<string> Roles { get; }
}

public class UserProvider : IUserProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public Guid Id => Guid.Parse(
        _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
        ?? throw new UnauthorizedException());
        
    public Guid CurrentOrganisationId => Guid.Parse(
        _httpContextAccessor.HttpContext?.User.FindFirst("OrganisationId")?.Value 
        ?? throw new UnauthorizedException());
}

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(nameof(Roles.Administrator), policy =>
        policy.RequireClaim("Role", nameof(Roles.Administrator)));
});
```

### 6. Request/Response Contracts
```csharp
// Request DTOs
public record CreateUserRequest(
    string Email,
    string Name,
    List<int> RoleIds
);

// Response DTOs
public record GetUsersResponse(
    List<UserDto> Users,
    int TotalCount
);

public record UserDto(
    Guid Id,
    string Email,
    string Name,
    List<string> Roles
);
```

### 7. Error Handling Pattern
```csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await HandleValidationException(context, ex);
        }
        catch (UnauthorizedException ex)
        {
            await HandleUnauthorizedException(context, ex);
        }
        catch (Exception ex)
        {
            await HandleGenericException(context, ex);
        }
    }
}
```

### 8. Configuration Pattern
```csharp
// Strongly-typed options
public class JwtOptions
{
    public string Secret { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 60;
    public string Issuer { get; set; } = string.Empty;
}

// Registration
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));

// Usage
public class JwtService : IJwtService
{
    private readonly JwtOptions _options;
    
    public JwtService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }
}
```

### 9. Database Operations Pattern
```csharp
// Repository pattern (optional, service layer often sufficient)
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    
    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }
}
```

### 10. Testing Pattern
```csharp
public class UserServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly UserService _service;
    
    public UserServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
            
        _context = new AppDbContext(options);
        _context.SeedTestData();
        
        _service = new UserService(_context);
    }
    
    [Fact]
    public async Task GetUsersAsync_ReturnsUsersForOrganisation()
    {
        // Arrange
        var orgId = TestData.OrganisationId;
        
        // Act
        var result = await _service.GetUsersAsync(orgId);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Users.Count);
    }
    
    public void Dispose() => _context.Dispose();
}
```

## Key Configuration Files

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=myapp;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Secret": "your-secret-key",
    "ExpirationMinutes": 60,
    "Issuer": "your-app"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Docker Support
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyApp.Api/MyApp.Api.csproj", "MyApp.Api/"]
RUN dotnet restore "MyApp.Api/MyApp.Api.csproj"
COPY . .
WORKDIR "/src/MyApp.Api"
RUN dotnet build "MyApp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyApp.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyApp.Api.dll"]
```

## Best Practices
1. **Feature-Based Organization**: Group related endpoints, services, and contracts
2. **Minimal APIs**: Use for cleaner, more performant endpoints
3. **Dependency Injection**: Use extension methods for clean registration
4. **Entity Framework**: Use Code-First with migrations
5. **Error Handling**: Consistent error responses with proper HTTP status codes
6. **Authentication**: JWT with organization context
7. **Observability**: OpenTelemetry integration for tracing
8. **Testing**: In-memory database for unit tests
9. **Configuration**: Strongly-typed options pattern
10. **Security**: Never expose sensitive data, use proper authorization

## Common Pitfalls to Avoid
1. **Entity Framework**:
   - Don't use lazy loading in production
   - Always use async methods for database operations
   - Include related entities explicitly with `.Include()`
   - Don't expose entities directly - use DTOs

2. **API Design**:
   - Don't return EF entities directly from endpoints
   - Always validate input with FluentValidation or data annotations
   - Use proper HTTP status codes (201 for created, 204 for no content)
   - Don't expose internal exceptions to clients

3. **Dependency Injection**:
   - Use correct service lifetimes (Scoped for DbContext)
   - Don't inject services into entities
   - Avoid service locator pattern

4. **Security**:
   - Never store passwords in plain text
   - Always validate JWT tokens
   - Don't expose sensitive data in logs
   - Use HTTPS in production

5. **Performance**:
   - Avoid N+1 queries with proper includes
   - Use pagination for list endpoints
   - Don't load unnecessary data
   - Use cancellation tokens

## Frontend-Backend Integration
```csharp
// Ensure DTOs match frontend interfaces
public record UserDto(
    Guid Id,
    string Email,
    string Name,
    List<string> Roles
);

// Consistent error response format
public record ErrorResponse(
    string Message,
    string? Code = null,
    Dictionary<string, string[]>? Details = null
);

// Standardized API response wrapper
public record ApiResponse<T>(
    bool Success,
    T? Data = default,
    ErrorResponse? Error = null
);

// Example endpoint with consistent response
app.MapGet("/api/v1/users/{id}", async (
    Guid id,
    IUserService service,
    CancellationToken ct) =>
{
    try
    {
        var user = await service.GetUserAsync(id, ct);
        return Results.Ok(new ApiResponse<UserDto>(true, user));
    }
    catch (NotFoundException)
    {
        return Results.NotFound(new ApiResponse<UserDto>(
            false, 
            Error: new ErrorResponse("User not found", "USER_NOT_FOUND")
        ));
    }
});