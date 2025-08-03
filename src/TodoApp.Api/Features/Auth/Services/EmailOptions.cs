namespace TodoApp.Api.Features.Auth.Services;

public class EmailOptions
{
    public const string SectionName = "Email";
    
    public string SmtpHost { get; set; } = "localhost";
    public int SmtpPort { get; set; } = 1025; // Default for MailDev
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = false;
    public string FromEmail { get; set; } = "noreply@todoapp.local";
    public string FromName { get; set; } = "TodoApp";
}