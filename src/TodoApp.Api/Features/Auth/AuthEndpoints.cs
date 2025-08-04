using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Data.Models;
using TodoApp.Api.Features.Auth.DTOs;
using TodoApp.Api.Features.Auth.Repositories;
using TodoApp.Api.Features.Auth.Services;

namespace TodoApp.Api.Features.Auth;

public static class AuthEndpoints
{
    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/auth")
            .WithTags("Authentication")
            .WithOpenApi();

        group.MapPost("/request-code", RequestVerificationCode)
            .WithName("RequestVerificationCode")
            .WithSummary("Request a verification code via email")
            .Produces<RequestCodeResponse>(StatusCodes.Status200OK)
            .Produces<ProblemDetails>(StatusCodes.Status400BadRequest)
            .Produces<ProblemDetails>(StatusCodes.Status429TooManyRequests);

        group.MapPost("/verify-code", VerifyCode)
            .WithName("VerifyCode")
            .WithSummary("Verify the email code")
            .Produces<VerifyCodeResponse>(StatusCodes.Status200OK)
            .Produces<ProblemDetails>(StatusCodes.Status400BadRequest);

        group.MapPost("/complete-registration", CompleteRegistration)
            .WithName("CompleteRegistration")
            .WithSummary("Complete registration for new users")
            .Produces<AuthResponse>(StatusCodes.Status200OK)
            .Produces<ProblemDetails>(StatusCodes.Status400BadRequest);

        return app;
    }

    private static async Task<IResult> RequestVerificationCode(
        [FromBody] RequestCodeRequest request,
        [FromServices] IValidator<RequestCodeRequest> validator,
        [FromServices] IVerificationTokenRepository tokenRepository,
        [FromServices] IEmailService emailService,
        [FromServices] ILogger<Program> logger,
        CancellationToken cancellationToken)
    {
        // Validate request
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var email = request.Email.ToLowerInvariant();

        // Check rate limiting (3 requests per hour)
        var recentRequests = await tokenRepository.GetRecentRequestsCountAsync(email, cancellationToken);

        if (recentRequests >= AuthConstants.RateLimitMaxRequests)
        {
            return AuthErrorHelpers.TooManyRequests();
        }

        // Generate 6-digit code
        var random = new Random();
        var code = random.Next(AuthConstants.VerificationCodeMin, AuthConstants.VerificationCodeMax).ToString();

        // Create verification token
        await tokenRepository.CreateTokenAsync(email, code, cancellationToken);

        // Send email
        await emailService.SendVerificationCodeAsync(email, code, cancellationToken);

        logger.LogInformation("Verification code sent to {Email}", email);

        return Results.Ok(new RequestCodeResponse(AuthConstants.VerificationCodeSentMessage));
    }

    private static async Task<IResult> VerifyCode(
        [FromBody] VerifyCodeRequest request,
        [FromServices] IValidator<VerifyCodeRequest> validator,
        [FromServices] IVerificationTokenRepository tokenRepository,
        [FromServices] TodoAppDbContext db,
        [FromServices] IJwtService jwtService,
        [FromServices] ILogger<Program> logger,
        CancellationToken cancellationToken)
    {
        // Validate request
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        
        var email = request.Email.ToLowerInvariant();

        // Find valid token
        var token = await tokenRepository.GetValidTokenAsync(email, request.Code, cancellationToken);

        if (token == null)
        {
            return AuthErrorHelpers.InvalidCode();
        }

        // Mark token as used
        await tokenRepository.MarkTokenAsUsedAsync(token, cancellationToken);

        // Check if user exists
        var user = await db.Users
            .Include(u => u.TeamMemberships)
                .ThenInclude(tm => tm.Team)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (user == null)
        {
            // New user - just validate the code, don't create account yet
            return Results.Ok(new VerifyCodeResponse(
                Token: "",
                IsNewUser: true
            ));
        }

        // Existing user - log them in
        user.LastLoginAt = DateTimeOffset.UtcNow;
        
        // For now, get the first team (later we'll support team selection)
        var membership = user.TeamMemberships.FirstOrDefault();
        if (membership == null)
        {
            return AuthErrorHelpers.NoTeamFound();
        }

        var jwtToken = jwtService.GenerateToken(user, membership.Team, membership.Role);
        
        await db.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("User {UserId} logged in", user.Id);

        return Results.Ok(new VerifyCodeResponse(
            Token: jwtToken,
            IsNewUser: false,
            User: new UserInfo(user.Id, user.Email, user.Name)
        ));
    }

    private static async Task<IResult> CompleteRegistration(
        [FromBody] CompleteRegistrationRequest request,
        [FromServices] IValidator<CompleteRegistrationRequest> validator,
        [FromServices] IVerificationTokenRepository tokenRepository,
        [FromServices] TodoAppDbContext db,
        [FromServices] IJwtService jwtService,
        [FromServices] IEmailService emailService,
        [FromServices] ILogger<Program> logger,
        CancellationToken cancellationToken)
    {
        // Validate request
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        
        var email = request.Email.ToLowerInvariant();

        // Verify the code again
        var token = await tokenRepository.GetValidUsedTokenAsync(email, request.Code, cancellationToken);

        if (token == null)
        {
            return AuthErrorHelpers.InvalidCode();
        }

        // Check if user already exists
        var existingUser = await db.Users.AnyAsync(u => u.Email == email, cancellationToken);
        if (existingUser)
        {
            return AuthErrorHelpers.UserAlreadyExists();
        }

        // Create new user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Name = request.DisplayName,
            IsEmailVerified = true,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            LastLoginAt = DateTimeOffset.UtcNow
        };

        // Create new team
        var team = new Team
        {
            Id = Guid.NewGuid(),
            Name = request.TeamName,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        // Create membership as admin
        var membership = new TeamMembership
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TeamId = team.Id,
            Role = TeamRole.Admin,
            JoinedAt = DateTimeOffset.UtcNow
        };

        db.Users.Add(user);
        db.Teams.Add(team);
        db.TeamMemberships.Add(membership);
        
        await db.SaveChangesAsync(cancellationToken);

        // Send welcome email
        await emailService.SendWelcomeEmailAsync(email, request.DisplayName, request.TeamName, cancellationToken);

        // Generate JWT token
        var jwtToken = jwtService.GenerateToken(user, team, TeamRole.Admin);
        
        logger.LogInformation("New user {UserId} registered with team {TeamId}", user.Id, team.Id);

        return Results.Ok(new AuthResponse(
            Token: jwtToken,
            User: new UserInfo(user.Id, user.Email, user.Name),
            Team: new TeamInfo(team.Id, team.Name, TeamRole.Admin.ToString())
        ));
    }
}