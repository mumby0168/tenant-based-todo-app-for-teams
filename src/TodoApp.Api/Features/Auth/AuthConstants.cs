namespace TodoApp.Api.Features.Auth;

public static class AuthConstants
{
    // Rate limiting
    public const int RateLimitMaxRequests = 3;
    public const int RateLimitWindowHours = 1;
    
    // Token settings
    public const int TokenExpirationMinutes = 15;
    public const int VerificationCodeLength = 6;
    public const int VerificationCodeMin = 100000;
    public const int VerificationCodeMax = 999999;
    
    // Error titles
    public const string InvalidEmailTitle = "Invalid email";
    public const string TooManyRequestsTitle = "Too many requests";
    public const string InvalidCodeTitle = "Invalid code";
    public const string NoTeamFoundTitle = "No team found";
    public const string UserExistsTitle = "User exists";
    
    // Error messages
    public const string InvalidEmailMessage = "Please provide a valid email address";
    public const string TooManyRequestsMessage = "You've requested too many codes. Please try again later.";
    public const string InvalidOrExpiredCodeMessage = "The verification code is invalid or has expired";
    public const string NoTeamMembershipMessage = "User has no team membership";
    public const string UserAlreadyExistsMessage = "An account with this email already exists";
    
    // Success messages
    public const string VerificationCodeSentMessage = "Verification code sent to your email";
    
    // Email settings
    public const string VerificationEmailSubject = "Your TodoApp verification code";
    public const string WelcomeEmailSubject = "Welcome to TodoApp!";
    
    // Default role
    public const string AdminRole = "Admin";
    
    // Validation messages
    public const string DisplayNameRequiredMessage = "Display name is required";
    public const string DisplayNameMinLengthMessage = "Display name must be at least 2 characters";
    public const string DisplayNameMaxLengthMessage = "Display name must not exceed 100 characters";
    public const string TeamNameRequiredMessage = "Team name is required";
    public const string TeamNameMinLengthMessage = "Team name must be at least 2 characters";
    public const string TeamNameMaxLengthMessage = "Team name must not exceed 100 characters";
    
    // Validation limits
    public const int NameMinLength = 2;
    public const int NameMaxLength = 100;
}