using BuildEstate.API.Authorization;
using BuildEstate.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.API.Controllers.Admin;

/// <summary>
/// Full user management CRUD — create, list, update, deactivate, assign roles.
/// SuperAdmin only.
/// </summary>
[ApiController]
[Route("api/v1/admin/users")]
[Authorize(Roles = "SuperAdmin")]
[Produces("application/json")]
public class UserManagementController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ILogger<UserManagementController> _logger;

    public UserManagementController(
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        ILogger<UserManagementController> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    /// <summary>Get all users with their roles.</summary>
    [HttpGet]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userManager.Users.ToListAsync();
        var result = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.IsActive,
                user.EmailConfirmed,
                user.LockoutEnd,
                user.LastLoginAt,
                user.CreatedAt,
                Roles = roles
            });
        }

        return Ok(new { success = true, data = result });
    }

    /// <summary>Get a single user by ID.</summary>
    [HttpGet("{id}")]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { success = false, errors = new[] { "User not found." } });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            success = true,
            data = new
            {
                user.Id, user.Email, user.FirstName, user.LastName,
                user.IsActive, user.EmailConfirmed, user.PhoneNumber,
                user.LockoutEnd, user.LastLoginAt, user.CreatedAt,
                Roles = roles
            }
        });
    }

    /// <summary>Create a new user with password and roles.</summary>
    [HttpPost]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { success = false, errors = new[] { "Email is required." } });

        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null)
            return Conflict(new { success = false, errors = new[] { "A user with this email already exists." } });

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName ?? "",
            LastName = request.LastName ?? "",
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, request.Password ?? "Default@123");
        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors.Select(e => e.Description).ToList() });

        if (request.Roles?.Any() == true)
        {
            foreach (var role in request.Roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                    await _userManager.AddToRoleAsync(user, role);
            }
        }

        _logger.LogInformation("User {UserId} '{Email}' created by admin", user.Id, user.Email);

        var assignedRoles = await _userManager.GetRolesAsync(user);
        return StatusCode(201, new
        {
            success = true,
            data = new { user.Id, user.Email, user.FirstName, user.LastName, user.IsActive, Roles = assignedRoles },
            message = "User created successfully."
        });
    }

    /// <summary>Update user details (name, active status).</summary>
    [HttpPut("{id}")]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { success = false, errors = new[] { "User not found." } });

        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.IsActive = request.IsActive ?? user.IsActive;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors.Select(e => e.Description).ToList() });

        _logger.LogInformation("User {UserId} updated by admin", user.Id);
        return NoContent();
    }

    /// <summary>Assign roles to a user (replaces existing roles).</summary>
    [HttpPut("{id}/roles")]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> AssignRoles(string id, [FromBody] AssignRolesRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { success = false, errors = new[] { "User not found." } });

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        if (request.Roles?.Any() == true)
        {
            foreach (var role in request.Roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                    await _userManager.AddToRoleAsync(user, role);
            }
        }

        _logger.LogInformation("User {UserId} roles updated to: {Roles}", user.Id, string.Join(", ", request.Roles ?? []));
        return Ok(new { success = true, message = "Roles updated successfully." });
    }

    /// <summary>Deactivate (soft-disable) a user.</summary>
    [HttpPatch("{id}/deactivate")]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> Deactivate(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { success = false, errors = new[] { "User not found." } });

        user.IsActive = false;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} deactivated", user.Id);
        return Ok(new { success = true, message = "User deactivated." });
    }

    /// <summary>Reactivate a user.</summary>
    [HttpPatch("{id}/activate")]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> Activate(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { success = false, errors = new[] { "User not found." } });

        user.IsActive = true;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} activated", user.Id);
        return Ok(new { success = true, message = "User activated." });
    }

    /// <summary>Get all available roles.</summary>
    [HttpGet("~/api/v1/admin/roles")]
    [HasPermission("Admin.Users")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _roleManager.Roles.Select(r => new { r.Name, r.Description }).ToListAsync();
        return Ok(new { success = true, data = roles });
    }
}

public record CreateUserRequest(string? Email, string? Password, string? FirstName, string? LastName, List<string>? Roles);
public record UpdateUserRequest(string? FirstName, string? LastName, bool? IsActive, string? PhoneNumber);
public record AssignRolesRequest(List<string>? Roles);
