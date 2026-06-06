using BuildEstate.Domain.Common;

namespace BuildEstate.Domain.Entities.Identity;

/// <summary>
/// Represents a refresh token issued to a user for silent JWT renewal.
/// Supports token rotation — each refresh token can only be used once.
/// Expired or revoked tokens are retained for audit trail purposes.
/// </summary>
public class RefreshToken : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? RevokedReason { get; set; }
    public string? ReplacedByToken { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired && !IsDeleted;
}
