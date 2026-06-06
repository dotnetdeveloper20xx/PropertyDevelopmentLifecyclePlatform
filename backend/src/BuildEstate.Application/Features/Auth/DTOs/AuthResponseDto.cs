namespace BuildEstate.Application.Features.Auth.DTOs;

/// <summary>
/// Response returned after successful authentication (login or refresh).
/// Contains the JWT access token, refresh token, and user info.
/// </summary>
public record AuthResponseDto
{
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public DateTime AccessTokenExpiresAt { get; init; }
    public UserInfoDto User { get; init; } = null!;
}

/// <summary>
/// Minimal user information returned with auth responses.
/// </summary>
public record UserInfoDto
{
    public string Id { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public List<string> Roles { get; init; } = new();
}
