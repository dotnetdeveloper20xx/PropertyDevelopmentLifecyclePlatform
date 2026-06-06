using BuildEstate.Application.Features.Auth.DTOs;

namespace BuildEstate.Application.Interfaces;

/// <summary>
/// Abstraction for authentication operations. Implemented in Infrastructure layer
/// to keep Application layer independent of ASP.NET Identity and infrastructure concerns.
/// 
/// This follows the Dependency Inversion principle — Application defines the contract,
/// Infrastructure provides the implementation.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Authenticates a user with email and password. Returns auth response with tokens.
    /// </summary>
    Task<AuthResponseDto> LoginAsync(string email, string password, CancellationToken cancellationToken = default);

    /// <summary>
    /// Registers a new user account with the specified role. Returns auth response with tokens.
    /// </summary>
    Task<AuthResponseDto> RegisterAsync(string email, string password, string firstName, string lastName, string? role, CancellationToken cancellationToken = default);

    /// <summary>
    /// Exchanges a valid refresh token for a new access + refresh token pair.
    /// </summary>
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the current authenticated user's profile.
    /// </summary>
    Task<UserInfoDto> GetCurrentUserAsync(CancellationToken cancellationToken = default);
}
