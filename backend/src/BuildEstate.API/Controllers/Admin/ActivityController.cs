using BuildEstate.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.API.Controllers.Admin;

/// <summary>
/// Returns activity (audit log entries) filtered by module/entity.
/// Used by module dashboards to show "Recent Activity" sections.
/// </summary>
[ApiController]
[Route("api/v1/activity")]
[Authorize]
[Produces("application/json")]
public class ActivityController : ControllerBase
{
    private readonly IAuditLogQuery _auditLogQuery;

    public ActivityController(IAuditLogQuery auditLogQuery)
    {
        _auditLogQuery = auditLogQuery;
    }

    /// <summary>
    /// Get recent activity for a specific module (entity name filter).
    /// Example: /api/v1/activity?module=LandOpportunity&limit=20
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetModuleActivity(
        [FromQuery] string? module = null,
        [FromQuery] int limit = 20,
        [FromQuery] string? entityId = null,
        CancellationToken ct = default)
    {
        var query = _auditLogQuery.Query();

        if (!string.IsNullOrWhiteSpace(module))
        {
            // Map module names to entity names
            var entityNames = MapModuleToEntities(module);
            query = query.Where(x => entityNames.Contains(x.EntityName));
        }

        if (!string.IsNullOrWhiteSpace(entityId))
            query = query.Where(x => x.EntityId == entityId);

        var limitClamped = Math.Clamp(limit, 1, 100);

        var entries = await query
            .OrderByDescending(x => x.Timestamp)
            .Take(limitClamped)
            .ToListAsync(ct);

        return Ok(new { success = true, data = entries });
    }

    private static List<string> MapModuleToEntities(string module)
    {
        return module.ToLower() switch
        {
            "land-acquisition" or "opportunities" => new() { "LandOpportunity", "DueDiligence", "Offer", "Document", "LandOwner", "LandAcquisitionRecord" },
            "planning" => new() { "PlanningApplication", "PlanningCondition", "PlanningAppeal" },
            "legal" => new() { "Contract", "LegalDocument", "ComplianceCheck", "LegalTask" },
            "projects" => new() { "Project", "Milestone", "ProjectTask", "ProjectRisk" },
            "construction" => new() { "ConstructionStage", "Inspection", "Snag" },
            "procurement" => new() { "PurchaseOrder", "Delivery" },
            "contractors" => new() { "Contractor" },
            "finance" => new() { "BudgetLine", "FinancialTransaction" },
            "investors" => new() { "Investor" },
            "units" => new() { "PropertyUnit" },
            "sales" => new() { "SalesLead" },
            "rentals" => new() { "Tenancy" },
            "documents" => new() { "KnowledgeDocument" },
            "reports" => new() { "SavedReport" },
            "portfolio" => new() { "Portfolio" },
            "feasibility" => new() { "FeasibilityAssessment" },
            "design" => new() { "DesignPackage" },
            "defects" => new() { "Defect" },
            _ => new() { module }
        };
    }
}
