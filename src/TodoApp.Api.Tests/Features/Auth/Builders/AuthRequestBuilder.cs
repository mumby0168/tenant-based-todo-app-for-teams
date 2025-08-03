namespace TodoApp.Api.Tests.Features.Auth.Builders;

public class AuthRequestBuilder
{
    private string _email = $"{Guid.NewGuid()}@test.com";
    private string _code = "123456";
    private string _displayName = "Test User";
    private string _teamName = "Test Team";
    
    public AuthRequestBuilder WithEmail(string email)
    {
        _email = email;
        return this;
    }
    
    public AuthRequestBuilder WithCode(string code)
    {
        _code = code;
        return this;
    }
    
    public AuthRequestBuilder WithDisplayName(string displayName)
    {
        _displayName = displayName;
        return this;
    }
    
    public AuthRequestBuilder WithTeamName(string teamName)
    {
        _teamName = teamName;
        return this;
    }
    
    public AuthRequestBuilder WithRandomEmail()
    {
        _email = $"{Guid.NewGuid()}@test.com";
        return this;
    }
    
    public object BuildRequestCodeRequest()
    {
        return new { email = _email };
    }
    
    public object BuildVerifyCodeRequest()
    {
        return new { email = _email, code = _code };
    }
    
    public object BuildCompleteRegistrationRequest()
    {
        return new 
        { 
            email = _email, 
            code = _code, 
            displayName = _displayName, 
            teamName = _teamName 
        };
    }
    
    public string Email => _email;
    public string Code => _code;
    public string DisplayName => _displayName;
    public string TeamName => _teamName;
}