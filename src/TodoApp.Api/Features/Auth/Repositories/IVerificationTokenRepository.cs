using TodoApp.Api.Data.Models;

namespace TodoApp.Api.Features.Auth.Repositories;

public interface IVerificationTokenRepository
{
    Task<int> GetRecentRequestsCountAsync(string email, CancellationToken cancellationToken = default);
    Task<VerificationToken?> GetValidTokenAsync(string email, string code, CancellationToken cancellationToken = default);
    Task<VerificationToken?> GetValidUsedTokenAsync(string email, string code, CancellationToken cancellationToken = default);
    Task<VerificationToken> CreateTokenAsync(string email, string code, CancellationToken cancellationToken = default);
    Task MarkTokenAsUsedAsync(VerificationToken token, CancellationToken cancellationToken = default);
}