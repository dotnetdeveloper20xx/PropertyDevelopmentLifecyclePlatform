using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Legal;

/// <summary>
/// Represents a compliance check (AML, KYC, title verification, etc.)
/// performed on a land opportunity.
/// </summary>
public class ComplianceCheck : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public ComplianceCheckType CheckType { get; set; }
    public ComplianceCheckStatus Status { get; set; } = ComplianceCheckStatus.NotStarted;
    public string? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string? Outcome { get; set; }
    public RiskLevel? RiskLevel { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
}
