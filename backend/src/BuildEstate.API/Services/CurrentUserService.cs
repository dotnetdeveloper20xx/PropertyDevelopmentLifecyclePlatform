using System.Security.Claims;
using BuildEstate.Application.Interfaces;

namespace BuildEstate.API.Services;

/// <summary>
/// Provides the current authenticated user's identity from HttpContext.
/// Registered as Scoped — one instance per HTTP request.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string? UserName =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email)
        ?? _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);

    public string? IpAddress =>
        _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();

    public string? CorrelationId =>
        _httpContextAccessor.HttpContext?.Items["CorrelationId"]?.ToString();
}
