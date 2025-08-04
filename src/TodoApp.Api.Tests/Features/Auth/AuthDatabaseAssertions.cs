using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data.Models;
using TodoApp.Api.Tests.Common;

namespace TodoApp.Api.Tests.Features.Auth;

public static class AuthDatabaseAssertions
{
    public static async Task AssertVerificationTokenExists(
        this IntegrationTestBase test, 
        string email, 
        VerificationTokenType type = VerificationTokenType.PasswordlessLogin,
        bool? isUsed = null)
    {
        await test.UseDbAsync(async db =>
        {
            var token = await db.VerificationTokens
                .FirstOrDefaultAsync(vt => vt.Email == email && vt.Type == type);
                
            token.Should().NotBeNull($"verification token for {email} should exist");
            token!.Type.Should().Be(type);
            token.ExpiresAt.Should().BeAfter(DateTimeOffset.UtcNow, "token should not be expired");
            
            if (isUsed.HasValue)
            {
                token.IsUsed.Should().Be(isUsed.Value, 
                    $"token IsUsed should be {isUsed.Value}");
            }
        });
    }
    
    public static async Task AssertUserExists(
        this IntegrationTestBase test, 
        string email, 
        string expectedName)
    {
        await test.UseDbAsync(async db =>
        {
            var user = await db.Users
                .FirstOrDefaultAsync(u => u.Email == email);
                
            user.Should().NotBeNull($"user with email {email} should exist");
            user!.Name.Should().Be(expectedName);
            user.IsEmailVerified.Should().BeTrue("user email should be verified");
            user.LastLoginAt.Should().NotBeNull("user should have logged in");
        });
    }
    
    public static async Task AssertUserWithTeamExists(
        this IntegrationTestBase test,
        string email,
        string expectedName,
        string expectedTeamName,
        TeamRole expectedRole = TeamRole.Admin)
    {
        await test.UseDbAsync(async db =>
        {
            var user = await db.Users
                .Include(u => u.TeamMemberships)
                .ThenInclude(tm => tm.Team)
                .FirstOrDefaultAsync(u => u.Email == email);
                
            user.Should().NotBeNull($"user with email {email} should exist");
            user!.Name.Should().Be(expectedName);
            user.TeamMemberships.Should().HaveCount(1, "user should have exactly one team membership");
            
            var membership = user.TeamMemberships.First();
            membership.Role.Should().Be(expectedRole);
            membership.Team.Name.Should().Be(expectedTeamName);
        });
    }
    
    public static async Task AssertTeamMembershipExists(
        this IntegrationTestBase test, 
        Guid userId, 
        Guid teamId, 
        TeamRole expectedRole)
    {
        await test.UseDbAsync(async db =>
        {
            var membership = await db.TeamMemberships
                .Include(tm => tm.Team)
                .Include(tm => tm.User)
                .FirstOrDefaultAsync(tm => tm.UserId == userId && tm.TeamId == teamId);
                
            membership.Should().NotBeNull(
                $"membership should exist for user {userId} in team {teamId}");
            membership!.Role.Should().Be(expectedRole);
            membership.JoinedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromMinutes(1));
        });
    }
    
    public static async Task AssertNoUserExists(
        this IntegrationTestBase test,
        string email)
    {
        await test.UseDbAsync(async db =>
        {
            var userExists = await db.Users.AnyAsync(u => u.Email == email);
            userExists.Should().BeFalse($"user with email {email} should not exist");
        });
    }
    
    public static async Task AssertVerificationTokenUsed(
        this IntegrationTestBase test,
        string email,
        string code)
    {
        await test.UseDbAsync(async db =>
        {
            var token = await db.VerificationTokens
                .FirstOrDefaultAsync(vt => vt.Email == email && vt.Token == code);
                
            token.Should().NotBeNull($"verification token for {email} with code {code} should exist");
            token!.IsUsed.Should().BeTrue("token should be marked as used");
            token.UsedAt.Should().NotBeNull("token should have UsedAt timestamp");
            token.UsedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromMinutes(1));
        });
    }
}