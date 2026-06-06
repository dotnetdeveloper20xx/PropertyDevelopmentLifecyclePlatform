using Microsoft.AspNetCore.Identity;

namespace BuildEstate.Infrastructure.Identity;

/// <summary>
/// Application role extending ASP.NET Identity.
/// </summary>
public class ApplicationRole : IdentityRole
{
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
