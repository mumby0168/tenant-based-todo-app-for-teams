using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace TodoApp.Api.Tests.Common;

public class TestAuthenticationSchemeOptions : AuthenticationSchemeOptions
{
    public Guid UserId { get; set; } = Guid.NewGuid();
    public Guid TeamId { get; set; } = Guid.NewGuid();
    public string Role { get; set; } = "Member";
    public string Email { get; set; } = "test@example.com";
    public string Name { get; set; } = "Test User";
}

public class TestAuthenticationHandler : AuthenticationHandler<TestAuthenticationSchemeOptions>
{
    public TestAuthenticationHandler(
        IOptionsMonitor<TestAuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Create test claims based on configured options
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, Options.UserId.ToString()),
            new Claim(ClaimTypes.Email, Options.Email),
            new Claim(ClaimTypes.Name, Options.Name),
            new Claim("team_id", Options.TeamId.ToString()),
            new Claim("team_name", "Test Team"),
            new Claim(ClaimTypes.Role, Options.Role)
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}