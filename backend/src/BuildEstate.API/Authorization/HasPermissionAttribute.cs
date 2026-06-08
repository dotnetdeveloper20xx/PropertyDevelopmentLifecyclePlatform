using Microsoft.AspNetCore.Authorization;

namespace BuildEstate.API.Authorization;

/// <summary>
/// Custom authorization attribute that checks if the user's role has a specific permission
/// in the RolePermissions table. Use: [HasPermission("Opportunities.Create")]
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(string permission)
        : base(policy: $"Permission:{permission}")
    {
    }
}
