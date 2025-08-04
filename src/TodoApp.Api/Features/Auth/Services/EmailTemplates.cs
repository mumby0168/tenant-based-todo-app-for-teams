namespace TodoApp.Api.Features.Auth.Services;

public static class EmailTemplates
{
    public const string VerificationCodeTemplate = """
        <h2>Welcome to TodoApp!</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; font-family: monospace; background-color: #f4f4f4; padding: 20px; text-align: center;">{0}</h1>
        <p>This code will expire in {1} minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        """;
        
    public const string WelcomeTemplate = """
        <h2>Welcome to TodoApp, {0}!</h2>
        <p>You've successfully created your account and joined the team "{1}".</p>
        <p>You can now start creating and managing todos with your team.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <br>
        <p>Best regards,<br>The TodoApp Team</p>
        """;
}