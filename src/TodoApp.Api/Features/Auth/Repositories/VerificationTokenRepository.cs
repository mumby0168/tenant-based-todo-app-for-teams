using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Data.Models;

namespace TodoApp.Api.Features.Auth.Repositories;

public class VerificationTokenRepository : IVerificationTokenRepository
{
    private readonly TodoAppDbContext _db;
    
    public VerificationTokenRepository(TodoAppDbContext db)
    {
        _db = db;
    }
    
    public async Task<int> GetRecentRequestsCountAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _db.VerificationTokens
            .Where(vt => vt.Email == email && 
                         vt.Type == VerificationTokenType.PasswordlessLogin &&
                         vt.CreatedAt > DateTimeOffset.UtcNow.AddHours(-AuthConstants.RateLimitWindowHours))
            .CountAsync(cancellationToken);
    }
    
    public async Task<VerificationToken?> GetValidTokenAsync(string email, string code, CancellationToken cancellationToken = default)
    {
        return await _db.VerificationTokens
            .Where(vt => vt.Email == email && 
                         vt.Token == code &&
                         vt.Type == VerificationTokenType.PasswordlessLogin &&
                         !vt.IsUsed &&
                         vt.ExpiresAt > DateTimeOffset.UtcNow)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    public async Task<VerificationToken?> GetValidUsedTokenAsync(string email, string code, CancellationToken cancellationToken = default)
    {
        return await _db.VerificationTokens
            .Where(vt => vt.Email == email && 
                         vt.Token == code &&
                         vt.Type == VerificationTokenType.PasswordlessLogin &&
                         vt.IsUsed && // Should have been used in verify-code
                         vt.ExpiresAt > DateTimeOffset.UtcNow)
            .FirstOrDefaultAsync(cancellationToken);
    }
    
    public async Task<VerificationToken> CreateTokenAsync(string email, string code, CancellationToken cancellationToken = default)
    {
        var token = new VerificationToken
        {
            Id = Guid.NewGuid(),
            Email = email,
            Token = code,
            Type = VerificationTokenType.PasswordlessLogin,
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(AuthConstants.TokenExpirationMinutes),
            CreatedAt = DateTimeOffset.UtcNow,
            IsUsed = false
        };

        _db.VerificationTokens.Add(token);
        await _db.SaveChangesAsync(cancellationToken);
        
        return token;
    }
    
    public async Task MarkTokenAsUsedAsync(VerificationToken token, CancellationToken cancellationToken = default)
    {
        token.IsUsed = true;
        token.UsedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
    }
}