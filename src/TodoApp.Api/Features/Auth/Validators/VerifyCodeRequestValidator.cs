using FluentValidation;
using TodoApp.Api.Features.Auth.DTOs;

namespace TodoApp.Api.Features.Auth.Validators;

public class VerifyCodeRequestValidator : AbstractValidator<VerifyCodeRequest>
{
    public VerifyCodeRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage(AuthConstants.InvalidEmailMessage)
            .EmailAddress()
            .WithMessage(AuthConstants.InvalidEmailMessage);
            
        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage(AuthConstants.InvalidOrExpiredCodeMessage)
            .Length(AuthConstants.VerificationCodeLength)
            .WithMessage(AuthConstants.InvalidOrExpiredCodeMessage)
            .Matches("^[0-9]+$")
            .WithMessage(AuthConstants.InvalidOrExpiredCodeMessage);
    }
}