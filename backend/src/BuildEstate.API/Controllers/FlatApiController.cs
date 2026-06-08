using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Entities.Defects;
using BuildEstate.Domain.Entities.Design;
using BuildEstate.Domain.Entities.Feasibility;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;
using BuildEstate.Infrastructure.Persistence;
using BuildEstate.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.API.Controllers;

/// <summary>
/// Flat (non-scoped) aggregate endpoints for modules whose primary endpoints are project/opportunity-scoped.
/// These allow the frontend detail/edit pages to fetch a single record by ID without knowing the parent scope.
/// </summary>
[ApiController]
[Authorize]
[Produces("application/json")]
public class FlatApiController : ControllerBase
{
    private readonly BuildEstateDbContext _db;
    public FlatApiController(BuildEstateDbContext db) { _db = db; }

    // ─── Construction Stages ───
    [HttpGet("api/v1/construction")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    public async Task<IActionResult> GetAllStages(CancellationToken ct)
    {
        var stages = await _db.ConstructionStages.AsNoTracking().OrderByDescending(s => s.CreatedAt).Take(200)
            .Select(s => new {
                s.Id, s.ProjectId, s.Name, s.Description, status = s.Status.ToString(),
                s.SortOrder, s.PlannedStartDate, s.PlannedEndDate, s.ActualStartDate, s.ActualEndDate,
                s.ProgressPercent, s.Notes, inspectionCount = 0, snagCount = 0, s.CreatedAt
            }).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = stages });
    }

    [HttpPut("api/v1/construction/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    public async Task<IActionResult> UpdateStage(Guid id, [FromBody] UpdateStageRequest req, CancellationToken ct)
    {
        var entity = await _db.ConstructionStages.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.Name = req.Name ?? entity.Name;
        entity.Description = req.Description;
        entity.ProgressPercent = req.ProgressPercent ?? entity.ProgressPercent;
        entity.PlannedStartDate = req.PlannedStartDate ?? entity.PlannedStartDate;
        entity.PlannedEndDate = req.PlannedEndDate ?? entity.PlannedEndDate;
        entity.ActualStartDate = req.ActualStartDate ?? entity.ActualStartDate;
        entity.ActualEndDate = req.ActualEndDate ?? entity.ActualEndDate;
        entity.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Design Packages ───
    [HttpGet("api/v1/design")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    public async Task<IActionResult> GetAllDesign(CancellationToken ct)
    {
        var items = await _db.DesignPackages.AsNoTracking().OrderByDescending(d => d.CreatedAt).Take(200).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPost("api/v1/design")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    public async Task<IActionResult> CreateDesign([FromBody] CreateDesignFlatRequest req, CancellationToken ct)
    {
        var entity = new DesignPackage
        {
            Id = Guid.NewGuid(), ProjectId = Guid.Empty, Title = req.Name,
            Description = req.Description, Discipline = req.Discipline,
            Consultant = req.Consultant, Notes = req.Notes,
            Status = DesignStageStatus.Draft, Version = 1,
            CreatedAt = DateTime.UtcNow, CreatedBy = User.Identity?.Name ?? "system"
        };
        _db.DesignPackages.Add(entity);
        await _db.SaveChangesAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = entity });
    }

    [HttpPut("api/v1/design/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    public async Task<IActionResult> UpdateDesign(Guid id, [FromBody] UpdateDesignRequest req, CancellationToken ct)
    {
        var entity = await _db.DesignPackages.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.Title = req.Name ?? entity.Title;
        entity.Description = req.Description;
        entity.Discipline = req.Discipline;
        entity.Consultant = req.Consultant;
        entity.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Feasibility ───
    [HttpGet("api/v1/feasibility")]
    [Authorize(Roles = "SuperAdmin,ValuationAnalyst,FinanceDirector,AcquisitionManager")]
    public async Task<IActionResult> GetAllFeasibility(CancellationToken ct)
    {
        var items = await _db.FeasibilityAssessments.AsNoTracking().OrderByDescending(f => f.CreatedAt).Take(200)
            .Select(f => new {
                f.Id, title = f.Scenario ?? "Untitled", description = f.Notes,
                status = f.Status.ToString(), f.OpportunityId,
                f.EstimatedLandCost, f.EstimatedBuildCost, f.ProfessionalFees, f.FinanceCosts,
                f.GrossDevelopmentValue, expectedRevenue = f.ExpectedSalesRevenue,
                estimatedProfit = f.EstimatedProfit, roi = f.ROI,
                assessedBy = f.CreatedBy, notes = f.ApprovalNotes ?? f.Notes, f.CreatedAt
            }).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPost("api/v1/feasibility")]
    [Authorize(Roles = "SuperAdmin,ValuationAnalyst,FinanceDirector,AcquisitionManager")]
    public async Task<IActionResult> CreateFeasibility([FromBody] CreateFeasibilityFlatRequest req, CancellationToken ct)
    {
        var entity = new FeasibilityAssessment
        {
            Id = Guid.NewGuid(), OpportunityId = Guid.Empty,
            EstimatedLandCost = req.EstimatedLandCost, EstimatedBuildCost = req.EstimatedBuildCost,
            ProfessionalFees = req.ProfessionalFees, FinanceCosts = req.FinanceCosts,
            GrossDevelopmentValue = req.GrossDevelopmentValue, ExpectedSalesRevenue = req.ExpectedRevenue,
            Notes = req.Notes, Scenario = req.Title, Status = FeasibilityStatus.Draft,
            CreatedAt = DateTime.UtcNow, CreatedBy = User.Identity?.Name ?? "system"
        };
        var totalCosts = entity.EstimatedLandCost + entity.EstimatedBuildCost + entity.ProfessionalFees + entity.FinanceCosts;
        entity.EstimatedProfit = entity.ExpectedSalesRevenue - totalCosts;
        entity.ROI = totalCosts > 0 ? Math.Round((entity.EstimatedProfit / totalCosts) * 100, 2) : 0;
        _db.FeasibilityAssessments.Add(entity);
        await _db.SaveChangesAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = entity });
    }

    [HttpPut("api/v1/feasibility/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ValuationAnalyst,FinanceDirector")]
    public async Task<IActionResult> UpdateFeasibility(Guid id, [FromBody] CreateFeasibilityFlatRequest req, CancellationToken ct)
    {
        var entity = await _db.FeasibilityAssessments.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.Scenario = req.Title;
        entity.Notes = req.Notes;
        entity.EstimatedLandCost = req.EstimatedLandCost;
        entity.EstimatedBuildCost = req.EstimatedBuildCost;
        entity.ProfessionalFees = req.ProfessionalFees;
        entity.FinanceCosts = req.FinanceCosts;
        entity.GrossDevelopmentValue = req.GrossDevelopmentValue;
        entity.ExpectedSalesRevenue = req.ExpectedRevenue;
        var totalCosts = entity.EstimatedLandCost + entity.EstimatedBuildCost + entity.ProfessionalFees + entity.FinanceCosts;
        entity.EstimatedProfit = entity.ExpectedSalesRevenue - totalCosts;
        entity.ROI = totalCosts > 0 ? Math.Round((entity.EstimatedProfit / totalCosts) * 100, 2) : 0;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Compliance Checks (flat) ───
    [HttpGet("api/v1/legal/compliance")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager")]
    public async Task<IActionResult> GetAllCompliance(CancellationToken ct)
    {
        var items = await _db.ComplianceChecks.AsNoTracking().OrderByDescending(c => c.CreatedAt).Take(200)
            .Select(c => new {
                c.Id, c.OpportunityId, checkType = c.CheckType.ToString(),
                status = c.Status.ToString(), c.AssignedTo, c.DueDate,
                c.CompletedDate, c.Outcome, riskLevel = c.RiskLevel != null ? c.RiskLevel.ToString() : null,
                c.Notes, c.CreatedAt
            }).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPost("api/v1/legal/compliance")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    public async Task<IActionResult> CreateCompliance([FromBody] CreateComplianceFlatRequest req, CancellationToken ct)
    {
        var entity = new ComplianceCheck
        {
            Id = Guid.NewGuid(), OpportunityId = Guid.Empty,
            CheckType = Enum.TryParse<ComplianceCheckType>(req.CheckType, out var cType) ? cType : ComplianceCheckType.AML,
            AssignedTo = req.AssignedTo, DueDate = req.DueDate, Notes = req.Notes,
            Status = ComplianceCheckStatus.NotStarted,
            CreatedAt = DateTime.UtcNow, CreatedBy = User.Identity?.Name ?? "system"
        };
        _db.ComplianceChecks.Add(entity);
        await _db.SaveChangesAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = new { entity.Id, checkType = entity.CheckType.ToString(), status = entity.Status.ToString(), entity.AssignedTo, entity.DueDate, entity.Notes, entity.CreatedAt } });
    }

    [HttpPut("api/v1/legal/compliance/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    public async Task<IActionResult> UpdateCompliance(Guid id, [FromBody] UpdateComplianceRequest req, CancellationToken ct)
    {
        var entity = await _db.ComplianceChecks.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.AssignedTo = req.AssignedTo;
        entity.DueDate = req.DueDate ?? entity.DueDate;
        entity.Outcome = req.Outcome;
        entity.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Due Diligence (flat) ───
    [HttpGet("api/v1/due-diligence")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager")]
    public async Task<IActionResult> GetAllDueDiligence(CancellationToken ct)
    {
        var items = await _db.DueDiligences.AsNoTracking().OrderByDescending(d => d.CreatedAt).Take(200)
            .Select(d => new {
                d.Id, d.OpportunityId, type = d.Type.ToString(), status = d.Status.ToString(),
                d.ReportDate, d.Findings, d.Notes, d.CreatedAt
            }).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPost("api/v1/due-diligence")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager")]
    public async Task<IActionResult> CreateDueDiligence([FromBody] CreateDueDiligenceFlatRequest req, CancellationToken ct)
    {
        var entity = new Domain.Entities.LandAcquisition.DueDiligence
        {
            Id = Guid.NewGuid(), OpportunityId = Guid.Empty,
            Type = Enum.TryParse<DueDiligenceType>(req.Type, out var ddType) ? ddType : DueDiligenceType.Legal,
            Findings = req.Findings, Notes = req.Notes, Status = DueDiligenceStatus.Pending,
            CreatedAt = DateTime.UtcNow, CreatedBy = User.Identity?.Name ?? "system"
        };
        _db.DueDiligences.Add(entity);
        await _db.SaveChangesAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = new { entity.Id, type = entity.Type.ToString(), status = entity.Status.ToString(), entity.Findings, entity.Notes, entity.CreatedAt } });
    }

    // ─── Defects (PUT only - GET already exists in DefectsController) ───
    [HttpPut("api/v1/defects/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager,PropertyManager")]
    public async Task<IActionResult> UpdateDefect(Guid id, [FromBody] UpdateDefectRequest req, CancellationToken ct)
    {
        var entity = await _db.Defects.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.Title = req.Title ?? entity.Title;
        entity.Description = req.Description;
        entity.Location = req.Location;
        entity.Priority = Enum.TryParse<DefectPriority>(req.Priority, out var p) ? p : entity.Priority;
        entity.AssignedTo = req.AssignedTo;
        entity.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Procurement ───
    [HttpGet("api/v1/procurement")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    public async Task<IActionResult> GetAllProcurement(CancellationToken ct)
    {
        var items = await _db.PurchaseOrders.AsNoTracking().OrderByDescending(o => o.CreatedAt).Take(200)
            .Select(o => new {
                o.Id, o.ProjectId, o.OrderReference, o.SupplierName, o.SupplierContact,
                o.Description, status = o.Status.ToString(), o.TotalValue, currency = o.Currency,
                orderDate = o.OrderDate, o.ExpectedDeliveryDate, o.ActualDeliveryDate,
                o.ApprovedBy, o.Notes, deliveryCount = 0, o.CreatedAt
            }).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPut("api/v1/procurement/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    public async Task<IActionResult> UpdateProcurement(Guid id, [FromBody] UpdateProcurementRequest req, CancellationToken ct)
    {
        var entity = await _db.PurchaseOrders.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.OrderReference = req.OrderReference ?? entity.OrderReference;
        entity.SupplierName = req.SupplierName ?? entity.SupplierName;
        entity.SupplierContact = req.SupplierContact;
        entity.Description = req.Description;
        entity.TotalValue = req.TotalValue ?? entity.TotalValue;
        entity.ExpectedDeliveryDate = req.ExpectedDeliveryDate ?? entity.ExpectedDeliveryDate;
        entity.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Finance ───
    [HttpGet("api/v1/finance")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,FinanceDirector")]
    public async Task<IActionResult> GetAllFinance(CancellationToken ct)
    {
        var items = await _db.FinancialTransactions.AsNoTracking().OrderByDescending(t => t.CreatedAt).Take(200)
            .Select(t => new {
                t.Id, t.ProjectId, budgetLineId = (string?)null,
                type = t.Type.ToString(), t.Description, t.Amount, t.Currency,
                status = "Processed", t.Reference, transactionDate = t.TransactionDate,
                approvedBy = (string?)null, t.Notes, t.CreatedAt
            }).ToListAsync(ct);
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPut("api/v1/finance/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    public async Task<IActionResult> UpdateFinance(Guid id, [FromBody] UpdateFinanceRequest req, CancellationToken ct)
    {
        var entity = await _db.FinancialTransactions.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.Description = req.Description ?? entity.Description;
        entity.Type = Enum.TryParse<TransactionType>(req.Type, out var t) ? t : entity.Type;
        entity.Amount = req.Amount ?? entity.Amount;
        entity.Currency = req.Currency ?? entity.Currency;
        entity.Reference = req.Reference;
        entity.Notes = req.Notes;
        if (req.TransactionDate != null) entity.TransactionDate = req.TransactionDate.Value;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ─── Units ───
    [HttpGet("api/v1/units")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SalesManager,PropertyManager")]
    public async Task<IActionResult> GetAllUnits(CancellationToken ct)
    {
        var raw = await _db.PropertyUnits.AsNoTracking().OrderByDescending(u => u.CreatedAt).Take(200).ToListAsync(ct);
        var items = raw.Select(u => new {
            u.Id, reference = u.UnitReference, type = u.UnitType ?? "Apartment",
            floor = u.Floor != null && int.TryParse(u.Floor, out var f) ? f : (int?)null,
            bedrooms = u.Bedrooms ?? 0, bathrooms = 1,
            areaSqFt = u.FloorArea, price = u.Price ?? 0m, currency = "GBP",
            status = u.Status.ToString(), notes = u.Notes, u.ProjectId, u.CreatedAt
        }).ToList();
        return Ok(new ApiResponse<object> { Success = true, Data = items });
    }

    [HttpPut("api/v1/units/{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SalesManager")]
    public async Task<IActionResult> UpdateUnit(Guid id, [FromBody] UpdateUnitRequest req, CancellationToken ct)
    {
        var entity = await _db.PropertyUnits.FindAsync(new object[] { id }, ct);
        if (entity == null) return NotFound();
        entity.UnitReference = req.Reference ?? entity.UnitReference;
        entity.UnitType = req.Type ?? entity.UnitType;
        entity.Floor = req.Floor ?? entity.Floor;
        entity.Bedrooms = req.Bedrooms ?? entity.Bedrooms;
        entity.FloorArea = req.AreaSqFt ?? entity.FloorArea;
        entity.Price = req.Price ?? entity.Price;
        entity.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}

// ─── Request DTOs ───
public record UpdateStageRequest(string? Name, string? Description, int? ProgressPercent, DateTime? PlannedStartDate, DateTime? PlannedEndDate, DateTime? ActualStartDate, DateTime? ActualEndDate, string? Notes);
public record UpdateDesignRequest(string? Name, string? Description, string? Discipline, string? Consultant, string? Notes);
public record CreateDesignFlatRequest(string Name, string? Description, string? Discipline, string? Consultant, string? Notes);
public record CreateFeasibilityFlatRequest(string Title, string? Description, decimal EstimatedLandCost, decimal EstimatedBuildCost, decimal ProfessionalFees, decimal FinanceCosts, decimal GrossDevelopmentValue, decimal ExpectedRevenue, string? Notes);
public record UpdateDefectRequest(string? Title, string? Description, string? Location, string? Priority, string? AssignedTo, string? Notes);
public record UpdateProcurementRequest(string? OrderReference, string? SupplierName, string? SupplierContact, string? Description, decimal? TotalValue, DateTime? ExpectedDeliveryDate, string? Notes);
public record UpdateFinanceRequest(string? Description, string? Type, decimal? Amount, string? Currency, string? Reference, DateTime? TransactionDate, string? Notes);
public record UpdateUnitRequest(string? Reference, string? Type, string? Floor, int? Bedrooms, decimal? AreaSqFt, decimal? Price, string? Notes);
public record CreateComplianceFlatRequest(string CheckType, string? AssignedTo, DateTime? DueDate, string? Notes);
public record UpdateComplianceRequest(string? AssignedTo, DateTime? DueDate, string? Outcome, string? Notes);
public record CreateDueDiligenceFlatRequest(string Type, string? Findings, string? Notes);
