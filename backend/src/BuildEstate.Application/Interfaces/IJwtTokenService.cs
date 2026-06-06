namespace BuildEstate.Application.Interfaces;

/// <summary>
/// Abstraction for JWT token generation and validation.
/// Implemented in the Infrastructure layer to keep Application layer
/// independent of token implementation details (signing algorithms, key management).
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Generates a JWT access token for the specified user with their roles as claims.
    /// </summary>
    string GenerateAccessToken(string userId, string email, IEnumerable<string> roles);

    /// <summary>
    /// Generates a cryptographically secure random refresh token string.
    /// </summary>
    string GenerateRefreshToken();
}
