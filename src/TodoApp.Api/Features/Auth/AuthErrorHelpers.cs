using Microsoft.AspNetCore.Mvc;

namespace TodoApp.Api.Features.Auth;

public static class AuthErrorHelpers
{
    public static IResult InvalidEmail() =>
        Results.BadRequest(new ProblemDetails
        {
            Title = AuthConstants.InvalidEmailTitle,
            Detail = AuthConstants.InvalidEmailMessage
        });
        
    public static IResult TooManyRequests() =>
        Results.Problem(
            title: AuthConstants.TooManyRequestsTitle,
            detail: AuthConstants.TooManyRequestsMessage,
            statusCode: StatusCodes.Status429TooManyRequests
        );
        
    public static IResult InvalidCode() =>
        Results.BadRequest(new ProblemDetails
        {
            Title = AuthConstants.InvalidCodeTitle,
            Detail = AuthConstants.InvalidOrExpiredCodeMessage
        });
        
    public static IResult NoTeamFound() =>
        Results.BadRequest(new ProblemDetails
        {
            Title = AuthConstants.NoTeamFoundTitle,
            Detail = AuthConstants.NoTeamMembershipMessage
        });
        
    public static IResult UserAlreadyExists() =>
        Results.BadRequest(new ProblemDetails
        {
            Title = AuthConstants.UserExistsTitle,
            Detail = AuthConstants.UserAlreadyExistsMessage
        });
}