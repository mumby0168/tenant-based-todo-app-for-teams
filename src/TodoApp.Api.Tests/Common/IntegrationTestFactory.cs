using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using Respawn;
using Testcontainers.PostgreSql;
using TodoApp.Api.Data;
using TodoApp.Api.Features.Auth.Services;

namespace TodoApp.Api.Tests.Common;

public class IntegrationTestFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private PostgreSqlContainer _postgres = null!;
    private Respawner _respawner = null!;
    private string _connectionString = null!;
    private bool _migrated = false;

    public MockEmailService MockEmailService { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        // Start PostgreSQL container
        _postgres = new PostgreSqlBuilder()
            .WithDatabase("todoapp_test")
            .WithUsername("test")
            .WithPassword("test")
            .Build();

        await _postgres.StartAsync();

        _connectionString = _postgres.GetConnectionString();
    }

    public new async Task DisposeAsync()
    {
        await _postgres.DisposeAsync();
        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Initialize mock email service if not already done
        MockEmailService ??= new MockEmailService();

        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Replace email service with mock
            services.RemoveAll<IEmailService>();
            services.AddSingleton<IEmailService>(MockEmailService);

            // Add test authentication scheme
            services.AddAuthentication("Test")
                .AddScheme<TestAuthenticationSchemeOptions, TestAuthenticationHandler>(
                    "Test", options => { });
        });

        builder.ConfigureLogging(logging =>
        {
            logging.ClearProviders();
            // Add console logging for debugging if needed
            // logging.AddConsole();
        });
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        // Configure connection string BEFORE Program.cs executes (this is the key!)
        builder.ConfigureHostConfiguration(config =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:todoapp-db"] = _connectionString
            });
        });

        var host = base.CreateHost(builder);

        // Run migrations once after host is created
        if (!_migrated)
        {
            using var scope = host.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TodoAppDbContext>();
            db.Database.Migrate();

            // Initialize Respawner after migrations
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();

            _respawner = Respawner.CreateAsync(conn, new RespawnerOptions
            {
                DbAdapter = DbAdapter.Postgres,
                SchemasToInclude = new[] { "public" }
            }).GetAwaiter().GetResult();

            _migrated = true;
        }

        return host;
    }

    public async Task ResetDatabaseAsync()
    {
        using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();
        await _respawner.ResetAsync(conn);
        MockEmailService.Clear();
    }

    public HttpClient CreateClientWithTestAuth(
        Guid? userId = null,
        Guid? teamId = null,
        string? role = null,
        string? email = null,
        string? name = null)
    {
        var client = WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                // Configure test authentication with provided values
                services.Configure<TestAuthenticationSchemeOptions>(options =>
                {
                    if (userId.HasValue) options.UserId = userId.Value;
                    if (teamId.HasValue) options.TeamId = teamId.Value;
                    if (role != null) options.Role = role;
                    if (email != null) options.Email = email;
                    if (name != null) options.Name = name;
                });
            });
        }).CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Test");

        return client;
    }
}