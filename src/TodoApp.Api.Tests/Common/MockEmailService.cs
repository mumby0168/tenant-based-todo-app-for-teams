using System.Collections.Concurrent;
using TodoApp.Api.Features.Auth.Services;

namespace TodoApp.Api.Tests.Common;

public class MockEmailService : IEmailService
{
    private readonly ConcurrentBag<SentEmail> _sentEmails = new();
    
    public IReadOnlyList<SentEmail> SentEmails => _sentEmails.ToList();
    
    public Task SendVerificationCodeAsync(string toEmail, string code, CancellationToken cancellationToken = default)
    {
        _sentEmails.Add(new SentEmail
        {
            To = toEmail,
            Type = EmailType.VerificationCode,
            Subject = "Your TodoApp verification code",
            Code = code,
            Body = $"Your verification code is: {code}",
            SentAt = DateTime.UtcNow
        });
        
        return Task.CompletedTask;
    }
    
    public Task SendWelcomeEmailAsync(string toEmail, string displayName, string teamName, CancellationToken cancellationToken = default)
    {
        _sentEmails.Add(new SentEmail
        {
            To = toEmail,
            Type = EmailType.Welcome,
            Subject = "Welcome to TodoApp!",
            Body = $"Welcome {displayName} to team {teamName}",
            SentAt = DateTime.UtcNow
        });
        
        return Task.CompletedTask;
    }
    
    public void Clear() => _sentEmails.Clear();
    
    public SentEmail? GetLastEmailFor(string email) => 
        _sentEmails.Where(e => e.To == email)
                   .OrderByDescending(e => e.SentAt)
                   .FirstOrDefault();
    
    public string? GetLastCodeFor(string email) => 
        GetLastEmailFor(email)?.Code;
        
    public SentEmail? GetWelcomeEmailFor(string email) =>
        _sentEmails.FirstOrDefault(e => e.To == email && e.Type == EmailType.Welcome);
    
    public IEnumerable<SentEmail> GetEmailsFor(string email) =>
        _sentEmails.Where(e => e.To == email).OrderBy(e => e.SentAt);
}

public class SentEmail
{
    public string To { get; set; } = string.Empty;
    public EmailType Type { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
}

public enum EmailType
{
    VerificationCode,
    Welcome
}