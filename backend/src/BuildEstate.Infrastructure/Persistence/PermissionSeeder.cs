using BuildEstate.Domain.Entities.Identity;
using BuildEstate.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Seeds permissions, role-permission matrix, and demo users for each role.
/// This establishes the production RBAC model.
/// </summary>
public static class PermissionSeeder
{
    public static async Task SeedPermissionsAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BuildEstateDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<BuildEstateDbContext>>();

        if (await context.Permissions.AnyAsync()) return;

        logger.LogInformation("Seeding permissions and role-permission matrix...");

        // ─── DEFINE ALL PERMISSIONS ───
        var permissions = new List<Permission>
        {
            // Portfolio
            P("Portfolio.View", "Portfolio", "View"), P("Portfolio.Create", "Portfolio", "Create"), P("Portfolio.Edit", "Portfolio", "Edit"), P("Portfolio.Delete", "Portfolio", "Delete"),
            // Land Acquisition
            P("Opportunities.View", "Opportunities", "View"), P("Opportunities.Create", "Opportunities", "Create"), P("Opportunities.Edit", "Opportunities", "Edit"), P("Opportunities.Delete", "Opportunities", "Delete"), P("Opportunities.ChangeStatus", "Opportunities", "ChangeStatus"),
            // Feasibility
            P("Feasibility.View", "Feasibility", "View"), P("Feasibility.Create", "Feasibility", "Create"), P("Feasibility.Approve", "Feasibility", "Approve"),
            // Due Diligence
            P("DueDiligence.View", "DueDiligence", "View"), P("DueDiligence.Create", "DueDiligence", "Create"), P("DueDiligence.Edit", "DueDiligence", "Edit"),
            // Planning
            P("Planning.View", "Planning", "View"), P("Planning.Create", "Planning", "Create"), P("Planning.Edit", "Planning", "Edit"), P("Planning.ChangeStatus", "Planning", "ChangeStatus"),
            // Legal
            P("Contracts.View", "Legal", "View"), P("Contracts.Create", "Legal", "Create"), P("Contracts.Edit", "Legal", "Edit"), P("Contracts.ChangeStatus", "Legal", "ChangeStatus"),
            P("Compliance.View", "Compliance", "View"), P("Compliance.Create", "Compliance", "Create"), P("Compliance.Edit", "Compliance", "Edit"),
            // Projects
            P("Projects.View", "Projects", "View"), P("Projects.Create", "Projects", "Create"), P("Projects.Edit", "Projects", "Edit"), P("Projects.ChangeStatus", "Projects", "ChangeStatus"), P("Projects.Delete", "Projects", "Delete"),
            // Design
            P("Design.View", "Design", "View"), P("Design.Create", "Design", "Create"), P("Design.Approve", "Design", "Approve"),
            // Construction
            P("Construction.View", "Construction", "View"), P("Construction.Create", "Construction", "Create"), P("Construction.Edit", "Construction", "Edit"),
            // Procurement
            P("Procurement.View", "Procurement", "View"), P("Procurement.Create", "Procurement", "Create"), P("Procurement.Approve", "Procurement", "Approve"),
            // Contractors
            P("Contractors.View", "Contractors", "View"), P("Contractors.Create", "Contractors", "Create"), P("Contractors.Edit", "Contractors", "Edit"),
            // Finance
            P("Finance.View", "Finance", "View"), P("Finance.Create", "Finance", "Create"), P("Finance.Approve", "Finance", "Approve"),
            // Investors
            P("Investors.View", "Investors", "View"), P("Investors.Create", "Investors", "Create"), P("Investors.Edit", "Investors", "Edit"),
            // Units
            P("Units.View", "Units", "View"), P("Units.Create", "Units", "Create"), P("Units.Edit", "Units", "Edit"),
            // Sales
            P("Sales.View", "Sales", "View"), P("Sales.Create", "Sales", "Create"), P("Sales.Edit", "Sales", "Edit"),
            // Rentals
            P("Rentals.View", "Rentals", "View"), P("Rentals.Create", "Rentals", "Create"), P("Rentals.Edit", "Rentals", "Edit"),
            // Defects
            P("Defects.View", "Defects", "View"), P("Defects.Create", "Defects", "Create"), P("Defects.Edit", "Defects", "Edit"),
            // Documents
            P("Documents.View", "Documents", "View"), P("Documents.Create", "Documents", "Create"), P("Documents.Delete", "Documents", "Delete"),
            // Reports
            P("Reports.View", "Reports", "View"), P("Reports.Create", "Reports", "Create"),
            // Admin
            P("Admin.Users", "Admin", "Users"), P("Admin.Roles", "Admin", "Roles"), P("Admin.AuditLog", "Admin", "AuditLog"), P("Admin.Settings", "Admin", "Settings"),
        };

        context.Permissions.AddRange(permissions);
        await context.SaveChangesAsync();

        // ─── ROLE-PERMISSION MATRIX ───
        var allPerms = await context.Permissions.ToListAsync();
        var allRoles = await roleManager.Roles.ToListAsync();

        var matrix = new Dictionary<string, string[]>
        {
            ["SuperAdmin"] = allPerms.Select(p => p.Name).ToArray(), // Full access
            ["AcquisitionManager"] = new[] { "Portfolio.View", "Opportunities.View", "Opportunities.Create", "Opportunities.Edit", "Opportunities.ChangeStatus", "Feasibility.View", "Feasibility.Create", "DueDiligence.View", "DueDiligence.Create", "DueDiligence.Edit", "Contracts.View", "Documents.View", "Documents.Create" },
            ["LegalOfficer"] = new[] { "Contracts.View", "Contracts.Create", "Contracts.Edit", "Contracts.ChangeStatus", "Compliance.View", "Compliance.Create", "Compliance.Edit", "DueDiligence.View", "DueDiligence.Create", "Documents.View", "Documents.Create" },
            ["PlanningManager"] = new[] { "Planning.View", "Planning.Create", "Planning.Edit", "Planning.ChangeStatus", "Opportunities.View", "Documents.View", "Documents.Create" },
            ["ProjectManager"] = new[] { "Projects.View", "Projects.Create", "Projects.Edit", "Projects.ChangeStatus", "Construction.View", "Construction.Create", "Construction.Edit", "Design.View", "Design.Create", "Procurement.View", "Procurement.Create", "Contractors.View", "Finance.View", "Units.View", "Documents.View", "Documents.Create", "Reports.View" },
            ["SiteManager"] = new[] { "Construction.View", "Construction.Create", "Construction.Edit", "Defects.View", "Defects.Create", "Defects.Edit", "Procurement.View", "Contractors.View", "Documents.View" },
            ["SalesManager"] = new[] { "Sales.View", "Sales.Create", "Sales.Edit", "Units.View", "Units.Edit", "Documents.View", "Reports.View" },
            ["CompletionManager"] = new[] { "Projects.View", "Defects.View", "Defects.Create", "Units.View", "Documents.View" },
            ["PropertyManager"] = new[] { "Rentals.View", "Rentals.Create", "Rentals.Edit", "Units.View", "Defects.View", "Defects.Create", "Documents.View" },
            ["FinanceDirector"] = new[] { "Finance.View", "Finance.Create", "Finance.Approve", "Investors.View", "Investors.Create", "Investors.Edit", "Portfolio.View", "Projects.View", "Opportunities.View", "Reports.View", "Reports.Create" },
            ["ValuationAnalyst"] = new[] { "Feasibility.View", "Feasibility.Create", "Feasibility.Approve", "Opportunities.View", "Finance.View", "Reports.View" },
            ["Surveyor"] = new[] { "Opportunities.View", "DueDiligence.View", "Construction.View", "Documents.View", "Documents.Create" },
            ["Admin"] = new[] { "Documents.View", "Documents.Create", "Reports.View", "Opportunities.View", "Projects.View", "Contractors.View" },
        };

        var rolePermissions = new List<RolePermission>();
        foreach (var (roleName, permNames) in matrix)
        {
            var role = allRoles.FirstOrDefault(r => r.Name == roleName);
            if (role == null) continue;

            foreach (var permName in permNames)
            {
                var perm = allPerms.FirstOrDefault(p => p.Name == permName);
                if (perm != null)
                    rolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = perm.Id });
            }
        }

        context.RolePermissions.AddRange(rolePermissions);
        await context.SaveChangesAsync();

        // ─── SEED DEMO USERS (one per key role) ───
        var demoUsers = new[]
        {
            ("acq@buildestate.co.uk", "Acq@123456", "Sarah", "Johnson", "AcquisitionManager"),
            ("legal@buildestate.co.uk", "Legal@123456", "Mark", "Williams", "LegalOfficer"),
            ("planning@buildestate.co.uk", "Plan@123456", "Emma", "Davis", "PlanningManager"),
            ("pm@buildestate.co.uk", "Proj@123456", "Michael", "Chen", "ProjectManager"),
            ("site@buildestate.co.uk", "Site@123456", "David", "Taylor", "SiteManager"),
            ("sales@buildestate.co.uk", "Sales@123456", "Lisa", "Brown", "SalesManager"),
            ("finance@buildestate.co.uk", "Fin@123456", "Robert", "Hayes", "FinanceDirector"),
            ("property@buildestate.co.uk", "Prop@123456", "Rachel", "Green", "PropertyManager"),
            ("completion@buildestate.co.uk", "Comp@123456", "James", "Wilson", "CompletionManager"),
            ("valuation@buildestate.co.uk", "Val@123456", "Sophie", "Clarke", "ValuationAnalyst"),
            ("surveyor@buildestate.co.uk", "Surv@123456", "Thomas", "Murphy", "Surveyor"),
            ("support@buildestate.co.uk", "Supp@123456", "Alice", "Cooper", "Admin"),
        };

        foreach (var (email, password, firstName, lastName, role) in demoUsers)
        {
            if (await userManager.FindByEmailAsync(email) != null) continue;

            var user = new ApplicationUser
            {
                UserName = email, Email = email, FirstName = firstName,
                LastName = lastName, EmailConfirmed = true, IsActive = true
            };
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, role);
        }

        logger.LogInformation("Permission seeding completed: {PermCount} permissions, {MatrixCount} role-permission mappings, {UserCount} demo users",
            permissions.Count, rolePermissions.Count, demoUsers.Length);
    }

    private static Permission P(string name, string module, string action) =>
        new() { Name = name, Module = module, Action = action, Description = $"{action} access for {module}" };
}
