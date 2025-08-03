using FluentValidation;
using TodoApp.Api.Features.Auth.DTOs;

namespace TodoApp.Api.Features.Auth.Validators;

public class RequestCodeRequestValidator : AbstractValidator<RequestCodeRequest>
{
    public RequestCodeRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage(AuthConstants.InvalidEmailMessage)
            .EmailAddress()
            .WithMessage(AuthConstants.InvalidEmailMessage);
    }
}