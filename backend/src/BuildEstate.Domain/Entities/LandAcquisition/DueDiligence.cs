using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.LandAcquisition;

/// <summary>
/// Represents a due diligence check for a land opportunity.
/// </summary>
public class DueDiligence : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public DueDiligenceType Type { get; set; }
    public DueDiligenceStatus Status { get; set; } = DueDiligenceStatus.Pending;
    public string? AssignedTo { get; set; }
    public DateTime? ReportDate { get; set; }
    public string? Findings { get; set; }
    public string? Recommendation { get; set; }
    public string? RiskLevel { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
}
