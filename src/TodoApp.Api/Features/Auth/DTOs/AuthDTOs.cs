namespace TodoApp.Api.Features.Auth.DTOs;

public record RequestCodeRequest(string Email);

public record RequestCodeResponse(string Message);

public record VerifyCodeRequest(string Email, string Code);

public record VerifyCodeResponse(
    string Token,
    bool IsNewUser,
    UserInfo? User = null
);

public record CompleteRegistrationRequest(
    string Email,
    string Code,
    string DisplayName,
    string TeamName
);

public record AuthResponse(
    string Token,
    UserInfo User,
    TeamInfo Team
);

public record UserInfo(
    Guid Id,
    string Email,
    string DisplayName
);

public record TeamInfo(
    Guid Id,
    string Name,
    string Role
);