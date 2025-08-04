namespace TodoApp.Api.Tests.Features.Auth;

public static class AuthTestConstants
{
    // API Endpoints
    public const string RequestCodeEndpoint = "/api/v1/auth/request-code";
    public const string VerifyCodeEndpoint = "/api/v1/auth/verify-code";
    public const string CompleteRegistrationEndpoint = "/api/v1/auth/complete-registration";
    
    // Response Messages
    public const string VerificationCodeSentMessage = "Verification code sent to your email";
    
    // Error Messages
    public const string InvalidOrExpiredCodeError = "The verification code is invalid or has expired";
    public const string AccountExistsError = "An account with this email already exists";
    public const string InvalidEmailError = "email";
    
    // Test Data
    public const string InvalidEmail = "invalid-email";
    public const string InvalidCode = "000000";
    public const string TestCode = "123456";
    public const string DefaultTestUserName = "Test User";
    public const string DefaultTestTeamName = "Test Team";
    public const string NewUserName = "New Name";
    public const string NewTeamName = "New Team";
    
    // Verification Code
    public const string VerificationCodePattern = @"^\d{6}$";
    public const int VerificationCodeLength = 6;
    
    // Rate Limiting
    public const int RateLimitMaxRequests = 3;
    public const int RateLimitWindowHours = 1;
    
    // Roles
    public const string AdminRole = "Admin";
    
    // Email Counts
    public const int ExistingUserEmailCount = 3; // Welcome + verification from registration + new verification
}