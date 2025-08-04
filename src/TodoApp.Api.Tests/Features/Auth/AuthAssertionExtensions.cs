using System.Net;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using TodoApp.Api.Features.Auth.DTOs;
using TodoApp.Api.Tests.Common;

namespace TodoApp.Api.Tests.Features.Auth;

public static class AuthAssertionExtensions
{
    // ApiResponse assertions
    public static ApiResponseAssertions<T> Should<T>(this ApiResponse<T> instance)
    {
        return new ApiResponseAssertions<T>(instance);
    }
    
    // AuthResponse assertions
    public static AuthResponseAssertions Should(this AuthResponse instance)
    {
        return new AuthResponseAssertions(instance);
    }
    
    // VerifyCodeResponse assertions
    public static VerifyCodeResponseAssertions Should(this VerifyCodeResponse instance)
    {
        return new VerifyCodeResponseAssertions(instance);
    }
    
    // SentEmail assertions
    public static SentEmailAssertions Should(this SentEmail? instance)
    {
        return new SentEmailAssertions(instance);
    }
}

public class ApiResponseAssertions<T> : ReferenceTypeAssertions<ApiResponse<T>, ApiResponseAssertions<T>>
{
    protected override string Identifier => "ApiResponse";
    
    public ApiResponseAssertions(ApiResponse<T> subject) : base(subject)
    {
    }
    
    public AndConstraint<ApiResponseAssertions<T>> HaveSuccessStatusCode(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .Given(() => Subject.StatusCode)
            .ForCondition(statusCode => (int)statusCode >= 200 && (int)statusCode < 300)
            .FailWith("Expected {context:response} to have success status code, but found {0}", Subject.StatusCode);
            
        return new AndConstraint<ApiResponseAssertions<T>>(this);
    }
    
    public AndConstraint<ApiResponseAssertions<T>> HaveStatusCode(HttpStatusCode expected, string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject.StatusCode == expected)
            .FailWith("Expected {context:response} to have status code {0}, but found {1}", expected, Subject.StatusCode);
            
        return new AndConstraint<ApiResponseAssertions<T>>(this);
    }
    
    public AndConstraint<ApiResponseAssertions<T>> HaveErrorDetail(string expectedDetail, string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject.Error != null)
            .FailWith("Expected {context:response} to have an error, but Error was null")
            .Then
            .ForCondition(Subject.Error!.Detail == expectedDetail)
            .FailWith("Expected {context:response} error detail to be {0}, but found {1}", expectedDetail, Subject.Error.Detail);
            
        return new AndConstraint<ApiResponseAssertions<T>>(this);
    }
    
    public AndConstraint<ApiResponseAssertions<T>> HaveContent(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject.Content != null)
            .FailWith("Expected {context:response} to have content, but Content was null");
            
        return new AndConstraint<ApiResponseAssertions<T>>(this);
    }
}

public class AuthResponseAssertions : ReferenceTypeAssertions<AuthResponse, AuthResponseAssertions>
{
    protected override string Identifier => "AuthResponse";
    
    public AuthResponseAssertions(AuthResponse subject) : base(subject)
    {
    }
    
    public AndConstraint<AuthResponseAssertions> BeValidForUser(
        string email, 
        string displayName, 
        string teamName, 
        string role = AuthTestConstants.AdminRole,
        string because = "", 
        params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject != null)
            .FailWith("Expected {context:auth response} to not be null")
            .Then
            .ForCondition(!string.IsNullOrEmpty(Subject!.Token))
            .FailWith("Expected {context:auth response} to have a token")
            .Then
            .ForCondition(Subject.User != null)
            .FailWith("Expected {context:auth response} to have user information")
            .Then
            .ForCondition(Subject.User!.Email == email)
            .FailWith("Expected user email to be {0}, but found {1}", email, Subject.User.Email)
            .Then
            .ForCondition(Subject.User.DisplayName == displayName)
            .FailWith("Expected user display name to be {0}, but found {1}", displayName, Subject.User.DisplayName)
            .Then
            .ForCondition(Subject.Team != null)
            .FailWith("Expected {context:auth response} to have team information")
            .Then
            .ForCondition(Subject.Team!.Name == teamName)
            .FailWith("Expected team name to be {0}, but found {1}", teamName, Subject.Team.Name)
            .Then
            .ForCondition(Subject.Team.Role == role)
            .FailWith("Expected team role to be {0}, but found {1}", role, Subject.Team.Role);
            
        return new AndConstraint<AuthResponseAssertions>(this);
    }
}

public class VerifyCodeResponseAssertions : ReferenceTypeAssertions<VerifyCodeResponse, VerifyCodeResponseAssertions>
{
    protected override string Identifier => "VerifyCodeResponse";
    
    public VerifyCodeResponseAssertions(VerifyCodeResponse subject) : base(subject)
    {
    }
    
    public AndConstraint<VerifyCodeResponseAssertions> BeForNewUser(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject != null)
            .FailWith("Expected {context:verify code response} to not be null")
            .Then
            .ForCondition(Subject!.IsNewUser)
            .FailWith("Expected IsNewUser to be true")
            .Then
            .ForCondition(Subject.User == null)
            .FailWith("Expected User to be null for new user")
            .Then
            .ForCondition(string.IsNullOrEmpty(Subject.Token))
            .FailWith("Expected Token to be empty for new user");
            
        return new AndConstraint<VerifyCodeResponseAssertions>(this);
    }
    
    public AndConstraint<VerifyCodeResponseAssertions> BeForExistingUser(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject != null)
            .FailWith("Expected {context:verify code response} to not be null")
            .Then
            .ForCondition(!Subject!.IsNewUser)
            .FailWith("Expected IsNewUser to be false")
            .Then
            .ForCondition(Subject.User != null)
            .FailWith("Expected User to not be null for existing user")
            .Then
            .ForCondition(!string.IsNullOrEmpty(Subject.Token))
            .FailWith("Expected Token to not be empty for existing user");
            
        return new AndConstraint<VerifyCodeResponseAssertions>(this);
    }
}

public class SentEmailAssertions : ReferenceTypeAssertions<SentEmail?, SentEmailAssertions>
{
    protected override string Identifier => "SentEmail";
    
    public SentEmailAssertions(SentEmail? subject) : base(subject)
    {
    }
    
    public AndConstraint<SentEmailAssertions> BeVerificationCodeEmail(string toEmail, string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject != null)
            .FailWith("Expected {context:sent email} to not be null")
            .Then
            .ForCondition(Subject!.To == toEmail)
            .FailWith("Expected email to be sent to {0}, but was sent to {1}", toEmail, Subject.To)
            .Then
            .ForCondition(Subject.Type == EmailType.VerificationCode)
            .FailWith("Expected email type to be VerificationCode, but was {0}", Subject.Type)
            .Then
            .ForCondition(!string.IsNullOrEmpty(Subject.Code))
            .FailWith("Expected email to contain a verification code");
            
        return new AndConstraint<SentEmailAssertions>(this);
    }
    
    public AndConstraint<SentEmailAssertions> BeWelcomeEmail(
        string toEmail, 
        string displayName, 
        string teamName, 
        string because = "", 
        params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject != null)
            .FailWith("Expected {context:sent email} to not be null")
            .Then
            .ForCondition(Subject!.To == toEmail)
            .FailWith("Expected email to be sent to {0}, but was sent to {1}", toEmail, Subject.To)
            .Then
            .ForCondition(Subject.Type == EmailType.Welcome)
            .FailWith("Expected email type to be Welcome, but was {0}", Subject.Type)
            .Then
            .ForCondition(Subject.Body.Contains(displayName))
            .FailWith("Expected welcome email to contain display name {0}", displayName)
            .Then
            .ForCondition(Subject.Body.Contains(teamName))
            .FailWith("Expected welcome email to contain team name {0}", teamName);
            
        return new AndConstraint<SentEmailAssertions>(this);
    }
    
    public AndConstraint<SentEmailAssertions> HaveValidVerificationCode(string because = "", params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(Subject?.Code != null)
            .FailWith("Expected {context:sent email} to have a verification code")
            .Then
            .ForCondition(Subject!.Code!.Length == AuthTestConstants.VerificationCodeLength)
            .FailWith("Expected verification code to have length {0}, but found {1}", 
                AuthTestConstants.VerificationCodeLength, Subject.Code.Length)
            .Then
            .ForCondition(System.Text.RegularExpressions.Regex.IsMatch(Subject.Code, AuthTestConstants.VerificationCodePattern))
            .FailWith("Expected verification code to match pattern {0}, but was {1}", 
                AuthTestConstants.VerificationCodePattern, Subject.Code);
            
        return new AndConstraint<SentEmailAssertions>(this);
    }
}

// Extension methods for string assertions
public static class StringVerificationCodeExtensions
{
    public static AndConstraint<StringAssertions> BeValidVerificationCode(
        this StringAssertions assertions, 
        string because = "", 
        params object[] becauseArgs)
    {
        Execute.Assertion
            .BecauseOf(because, becauseArgs)
            .ForCondition(!string.IsNullOrEmpty(assertions.Subject))
            .FailWith("Expected {context:string} to be a valid verification code, but it was null or empty")
            .Then
            .ForCondition(assertions.Subject!.Length == AuthTestConstants.VerificationCodeLength)
            .FailWith("Expected {context:string} to have length {0}, but found {1}", 
                AuthTestConstants.VerificationCodeLength, assertions.Subject.Length)
            .Then
            .ForCondition(System.Text.RegularExpressions.Regex.IsMatch(assertions.Subject, AuthTestConstants.VerificationCodePattern))
            .FailWith("Expected {context:string} to match pattern {0}, but was {1}", 
                AuthTestConstants.VerificationCodePattern, assertions.Subject);
            
        return new AndConstraint<StringAssertions>(assertions);
    }
}