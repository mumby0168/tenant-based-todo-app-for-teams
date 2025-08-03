using Bogus;

namespace TodoApp.Api.Tests.Features.Auth.Builders;

public class AuthTestDataBuilder
{
    private readonly Faker _faker = new();
    
    public string GenerateEmail() => $"{Guid.NewGuid()}@test.com";
    
    public string GenerateDisplayName() => _faker.Name.FullName();
    
    public string GenerateTeamName() => _faker.Company.CompanyName();
    
    public (string email, string displayName, string teamName) GenerateNewUserData()
    {
        return (GenerateEmail(), GenerateDisplayName(), GenerateTeamName());
    }
    
    public string GenerateInvalidEmail() => AuthTestConstants.InvalidEmail;
    
    public string GenerateInvalidCode() => AuthTestConstants.InvalidCode;
    
    public string GenerateTestCode() => AuthTestConstants.TestCode;
}