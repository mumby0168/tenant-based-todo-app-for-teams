using System.Net;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Features.Auth.DTOs;
using TodoApp.Api.Tests.Common;

namespace TodoApp.Api.Tests.Features.Auth;

public static class AuthTestHelpers
{
    public static async Task<string> RequestAndGetVerificationCode(this IntegrationTestBase test, string email)
    {
        var response = await test.PostAsync<RequestCodeResponse>(
            AuthTestConstants.RequestCodeEndpoint,
            new { email });
            
        response.Should().HaveStatusCode(HttpStatusCode.OK);
        
        return await test.GetVerificationCodeForAsync(email);
    }
    
    public static async Task<ApiResponse<VerifyCodeResponse>> VerifyCodeForNewUser(
        this IntegrationTestBase test, 
        string email, 
        string code)
    {
        var response = await test.PostAsync<VerifyCodeResponse>(
            AuthTestConstants.VerifyCodeEndpoint,
            new { email, code });
            
        response.Should().HaveStatusCode(HttpStatusCode.OK);
        response.Should().HaveContent();
        response.Content.Should().BeForNewUser();
        
        return response;
    }
    
    public static async Task<ApiResponse<VerifyCodeResponse>> VerifyCodeForExistingUser(
        this IntegrationTestBase test, 
        string email, 
        string code)
    {
        var response = await test.PostAsync<VerifyCodeResponse>(
            AuthTestConstants.VerifyCodeEndpoint,
            new { email, code });
            
        response.Should().HaveStatusCode(HttpStatusCode.OK);
        response.Should().HaveContent();
        response.Content.Should().BeForExistingUser();
        
        return response;
    }
    
    public static async Task SendMultipleCodeRequests(
        this IntegrationTestBase test, 
        string email, 
        int count)
    {
        for (int i = 0; i < count; i++)
        {
            var response = await test.PostAsync<RequestCodeResponse>(
                AuthTestConstants.RequestCodeEndpoint,
                new { email });
                
            if (i < AuthTestConstants.RateLimitMaxRequests)
            {
                response.Should().HaveStatusCode(HttpStatusCode.OK);
            }
        }
    }
    
    public static async Task ExpireVerificationToken(this IntegrationTestBase test, string email)
    {
        await test.UseDbAsync(async db =>
        {
            var token = await db.VerificationTokens
                .FirstOrDefaultAsync(vt => vt.Email == email);
                
            if (token != null)
            {
                token.ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(-1);
                await db.SaveChangesAsync();
            }
        });
    }
    
    public static async Task<AuthResponse> CompleteRegistrationFlow(
        this IntegrationTestBase test,
        string email,
        string displayName,
        string teamName)
    {
        // Request code
        var code = await test.RequestAndGetVerificationCode(email);
        
        // Verify code
        await test.VerifyCodeForNewUser(email, code);
        
        // Complete registration
        var response = await test.PostAsync<AuthResponse>(
            AuthTestConstants.CompleteRegistrationEndpoint,
            new { email, code, displayName, teamName });
            
        response.Should().HaveStatusCode(HttpStatusCode.OK);
        response.Should().HaveContent();
        
        return response.Content!;
    }
}