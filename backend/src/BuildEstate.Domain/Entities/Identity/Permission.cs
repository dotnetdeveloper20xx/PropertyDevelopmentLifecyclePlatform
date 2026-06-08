namespace BuildEstate.Domain.Entities.Identity;

/// <summary>
/// Represents a granular permission that can be assigned to roles.
/// Permissions follow the pattern: Module.Action (e.g., "Opportunities.Create", "Projects.Delete")
/// </summary>
public class Permission
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? Description { get; set; }
}

/// <summary>
/// Join table: which permissions are assigned to which roles.
/// </summary>
public class RolePermission
{
    public int Id { get; set; }
    public string RoleId { get; set; } = string.Empty;
    public int PermissionId { get; set; }

    public Permission Permission { get; set; } = null!;
}
