namespace TodoApp.Api.Features.Auth.Services;

public interface IEmailService
{
    Task SendVerificationCodeAsync(string toEmail, string code, CancellationToken cancellationToken = default);
    Task SendWelcomeEmailAsync(string toEmail, string displayName, string teamName, CancellationToken cancellationToken = default);
}