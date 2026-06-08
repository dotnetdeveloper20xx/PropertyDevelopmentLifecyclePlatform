using BuildEstate.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BuildEstate.API.Authorization;

/// <summary>
/// Custom authorization handler that checks the RolePermissions table
/// to determine if the current user's role(s) have the required permission.
/// </summary>
public class PermissionRequirement : IAuthorizationRequirement
{
    public string Permission { get; }
    public PermissionRequirement(string permission) => Permission = permission;
}

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public PermissionAuthorizationHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return;

        // SuperAdmin bypasses all permission checks
        if (context.User.IsInRole("SuperAdmin"))
        {
            context.Succeed(requirement);
            return;
        }

        // Get user's roles from claims
        var roles = context.User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        if (!roles.Any())
            return;

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<BuildEstateDbContext>();

        // Check if any of the user's roles have the required permission
        var hasPermission = await db.RolePermissions
            .AnyAsync(rp =>
                roles.Contains(rp.RoleId) &&
                rp.Permission.Name == requirement.Permission);

        // Also check by role name (since RoleId might be the GUID, but we store role names in claims)
        if (!hasPermission)
        {
            var roleIds = await db.Roles
                .Where(r => roles.Contains(r.Name!))
                .Select(r => r.Id)
                .ToListAsync();

            hasPermission = await db.RolePermissions
                .AnyAsync(rp =>
                    roleIds.Contains(rp.RoleId) &&
                    rp.Permission.Name == requirement.Permission);
        }

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
    }
}

/// <summary>
/// Dynamically creates authorization policies for permission-based requirements.
/// Any policy prefixed with "Permission:" is treated as a permission requirement.
/// </summary>
public class PermissionPolicyProvider : DefaultAuthorizationPolicyProvider
{
    public PermissionPolicyProvider(Microsoft.Extensions.Options.IOptions<AuthorizationOptions> options)
        : base(options) { }

    public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (policyName.StartsWith("Permission:", StringComparison.OrdinalIgnoreCase))
        {
            var permission = policyName["Permission:".Length..];
            var policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new PermissionRequirement(permission))
                .Build();
            return policy;
        }

        return await base.GetPolicyAsync(policyName);
    }
}
