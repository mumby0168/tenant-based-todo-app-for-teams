using FluentValidation;
using TodoApp.Api.Features.Auth.DTOs;

namespace TodoApp.Api.Features.Auth.Validators;

public class CompleteRegistrationRequestValidator : AbstractValidator<CompleteRegistrationRequest>
{
    public CompleteRegistrationRequestValidator()
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
            
        RuleFor(x => x.DisplayName)
            .NotEmpty()
            .WithMessage(AuthConstants.DisplayNameRequiredMessage)
            .MinimumLength(AuthConstants.NameMinLength)
            .WithMessage(AuthConstants.DisplayNameMinLengthMessage)
            .MaximumLength(AuthConstants.NameMaxLength)
            .WithMessage(AuthConstants.DisplayNameMaxLengthMessage);
            
        RuleFor(x => x.TeamName)
            .NotEmpty()
            .WithMessage(AuthConstants.TeamNameRequiredMessage)
            .MinimumLength(AuthConstants.NameMinLength)
            .WithMessage(AuthConstants.TeamNameMinLengthMessage)
            .MaximumLength(AuthConstants.NameMaxLength)
            .WithMessage(AuthConstants.TeamNameMaxLengthMessage);
    }
}