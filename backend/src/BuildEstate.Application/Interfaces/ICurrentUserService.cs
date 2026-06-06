namespace BuildEstate.Application.Interfaces;

/// <summary>
/// Provides access to the current authenticated user's identity.
/// Implemented in the Infrastructure/API layer via HttpContext.
/// </summary>
public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    string? IpAddress { get; }
    string? CorrelationId { get; }
}
