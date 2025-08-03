namespace TodoApp.Api.Data.Models;

public class VerificationToken
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Token { get; set; }
    public VerificationTokenType Type { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTimeOffset? UsedAt { get; set; }
}

public enum VerificationTokenType
{
    EmailVerification = 0,
    PasswordlessLogin = 1
}