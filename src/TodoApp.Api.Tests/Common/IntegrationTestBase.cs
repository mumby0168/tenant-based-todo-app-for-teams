using System.Net;
using System.Net.Http.Json;
using Bogus;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TodoApp.Api.Data;
using TodoApp.Api.Features.Auth.DTOs;

namespace TodoApp.Api.Tests.Common;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestFactory>, IAsyncLifetime
{
    protected readonly IntegrationTestFactory Factory;
    protected readonly HttpClient Client;
    protected MockEmailService MockEmailService => Factory.MockEmailService;
    protected readonly Faker Faker = new();
    
    protected IntegrationTestBase(IntegrationTestFactory factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }
    
    public async Task InitializeAsync()
    {
        // Database migration is handled in IntegrationTestFactory
        await Task.CompletedTask;
    }
    
    public async Task DisposeAsync()
    {
        // Reset database to clean state
        await Factory.ResetDatabaseAsync();
    }
    
    // Generate unique test data
    protected string GenerateTestEmail() => $"{Guid.NewGuid()}@test.com";
    protected string GenerateTestName() => Faker.Name.FullName();
    protected string GenerateTeamName() => Faker.Company.CompanyName();
    
    // Database helpers
    public async Task UseDbAsync(Func<TodoAppDbContext, Task> action)
    {
        using var scope = Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TodoAppDbContext>();
        await action(db);
    }
    
    public async Task<T> UseDbAsync<T>(Func<TodoAppDbContext, Task<T>> action)
    {
        using var scope = Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TodoAppDbContext>();
        return await action(db);
    }
    
    // HTTP helpers with better request/response handling
    public async Task<ApiResponse<T>> PostAsync<T>(string endpoint, object request)
    {
        var response = await Client.PostAsJsonAsync(endpoint, request);
        return await CreateApiResponse<T>(response);
    }
    
    public async Task<ApiResponse<T>> GetAsync<T>(string endpoint)
    {
        var response = await Client.GetAsync(endpoint);
        return await CreateApiResponse<T>(response);
    }
    
    public async Task<ApiResponse<T>> PutAsync<T>(string endpoint, object request)
    {
        var response = await Client.PutAsJsonAsync(endpoint, request);
        return await CreateApiResponse<T>(response);
    }
    
    public async Task<ApiResponse<T>> DeleteAsync<T>(string endpoint)
    {
        var response = await Client.DeleteAsync(endpoint);
        return await CreateApiResponse<T>(response);
    }
    
    private async Task<ApiResponse<T>> CreateApiResponse<T>(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        
        var apiResponse = new ApiResponse<T>
        {
            StatusCode = response.StatusCode,
            RawContent = content,
            Headers = response.Headers.ToDictionary(h => h.Key, h => h.Value.ToList())
        };
        
        if (response.IsSuccessStatusCode)
        {
            if (!string.IsNullOrWhiteSpace(content))
            {
                apiResponse.Content = await response.Content.ReadFromJsonAsync<T>();
            }
        }
        else
        {
            try
            {
                apiResponse.Error = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            }
            catch
            {
                // If we can't parse as ProblemDetails, leave Error as null
            }
        }
        
        return apiResponse;
    }
    
    // Auth helpers
    public Task<string> GetVerificationCodeForAsync(string email)
    {
        var code = MockEmailService.GetLastCodeFor(email) 
            ?? throw new InvalidOperationException($"No verification code found for {email}");
        return Task.FromResult(code);
    }
    
    public async Task<AuthResponse> RegisterNewUserAsync(
        string? email = null, 
        string? displayName = null, 
        string? teamName = null)
    {
        email ??= GenerateTestEmail();
        displayName ??= GenerateTestName();
        teamName ??= GenerateTeamName();
        
        // Request code
        var requestCodeResponse = await PostAsync<RequestCodeResponse>(
            "/api/v1/auth/request-code", 
            new { email });
        requestCodeResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        
        // Get code
        var code = await GetVerificationCodeForAsync(email);
        
        // Verify code
        var verifyResponse = await PostAsync<VerifyCodeResponse>(
            "/api/v1/auth/verify-code",
            new { email, code });
        verifyResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        verifyResponse.Content!.IsNewUser.Should().BeTrue();
        
        // Complete registration
        var completeResponse = await PostAsync<AuthResponse>(
            "/api/v1/auth/complete-registration",
            new { email, code, displayName, teamName });
        completeResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        
        return completeResponse.Content!;
    }
    
    protected HttpClient CreateAuthenticatedClient(AuthResponse authResponse)
    {
        var client = Factory.CreateClientWithTestAuth(
            authResponse.User.Id,
            authResponse.Team.Id,
            authResponse.Team.Role,
            authResponse.User.Email,
            authResponse.User.DisplayName
        );
        
        // Add custom header to ensure the team ID is used correctly
        client.DefaultRequestHeaders.Add("X-Test-Team-Id", authResponse.Team.Id.ToString());
        
        return client;
    }
    
    protected HttpClient CreateAuthenticatedClient(
        Guid? userId = null, 
        Guid? teamId = null, 
        string? role = null,
        string? email = null,
        string? name = null)
    {
        return Factory.CreateClientWithTestAuth(userId, teamId, role, email, name);
    }
}

public class ApiResponse<T>
{
    public HttpStatusCode StatusCode { get; set; }
    public T? Content { get; set; }
    public ProblemDetails? Error { get; set; }
    public string RawContent { get; set; } = "";
    public Dictionary<string, List<string>> Headers { get; set; } = new();
    public bool IsSuccess => (int)StatusCode >= 200 && (int)StatusCode < 300;
}