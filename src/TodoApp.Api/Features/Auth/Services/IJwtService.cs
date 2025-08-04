using System.Security.Claims;
using TodoApp.Api.Data.Models;

namespace TodoApp.Api.Features.Auth.Services;

public interface IJwtService
{
    string GenerateToken(User user, Team team, TeamRole role);
    ClaimsPrincipal? ValidateToken(string token);
}