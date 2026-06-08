using BuildEstate.API.Authorization;
using BuildEstate.Infrastructure.Identity;
using BuildEstate.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.API.Controllers.Admin;

/// <summary>
/// Manages the permission matrix — which roles have which permissions.
/// SuperAdmin only.
/// </summary>
[ApiController]
[Route("api/v1/admin/permissions")]
[Authorize(Roles = "SuperAdmin")]
[Produces("application/json")]
public class PermissionsController : ControllerBase
{
    private readonly BuildEstateDbContext _context;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public PermissionsController(BuildEstateDbContext context, RoleManager<ApplicationRole> roleManager)
    {
        _context = context;
        _roleManager = roleManager;
    }

    /// <summary>Get all permissions grouped by module.</summary>
    [HttpGet]
    [HasPermission("Admin.Roles")]
    public async Task<IActionResult> GetAllPermissions()
    {
        var permissions = await _context.Permissions
            .OrderBy(p => p.Module).ThenBy(p => p.Action)
            .Select(p => new { p.Id, p.Name, p.Module, p.Action, p.Description })
            .ToListAsync();

        return Ok(new { success = true, data = permissions });
    }

    /// <summary>Get the full role-permission matrix.</summary>
    [HttpGet("matrix")]
    [HasPermission("Admin.Roles")]
    public async Task<IActionResult> GetMatrix()
    {
        var roles = await _roleManager.Roles
            .Select(r => new { r.Id, r.Name, r.Description })
            .ToListAsync();

        var permissions = await _context.Permissions
            .OrderBy(p => p.Module).ThenBy(p => p.Action)
            .Select(p => new { p.Id, p.Name, p.Module, p.Action })
            .ToListAsync();

        var rolePermissions = await _context.RolePermissions
            .Select(rp => new { rp.RoleId, rp.PermissionId })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = new
            {
                roles,
                permissions,
                assignments = rolePermissions
            }
        });
    }

    /// <summary>Assign or revoke a permission for a role.</summary>
    [HttpPost("assign")]
    [HasPermission("Admin.Roles")]
    public async Task<IActionResult> AssignPermission([FromBody] AssignPermissionRequest request)
    {
        var existing = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == request.RoleId && rp.PermissionId == request.PermissionId);

        if (request.Grant)
        {
            if (existing != null)
                return Ok(new { success = true, message = "Permission already assigned." });

            _context.RolePermissions.Add(new Domain.Entities.Identity.RolePermission
            {
                RoleId = request.RoleId,
                PermissionId = request.PermissionId
            });
        }
        else
        {
            if (existing == null)
                return Ok(new { success = true, message = "Permission not assigned." });

            _context.RolePermissions.Remove(existing);
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true, message = request.Grant ? "Permission granted." : "Permission revoked." });
    }
}

public record AssignPermissionRequest(string RoleId, int PermissionId, bool Grant);
