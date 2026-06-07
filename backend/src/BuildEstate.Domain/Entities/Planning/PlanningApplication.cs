using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Planning;

/// <summary>
/// Represents a planning application submitted to a local council.
/// Links to a LandOpportunity via OpportunityId.
/// </summary>
public class PlanningApplication : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public string ApplicationReference { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LocalAuthority { get; set; } = string.Empty;
    public string ApplicationType { get; set; } = string.Empty;
    public PlanningApplicationStatus Status { get; set; } = PlanningApplicationStatus.PreApplication;
    public DateTime? SubmissionDate { get; set; }
    public DateTime? ValidationDate { get; set; }
    public DateTime? DecisionDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? DecisionNotice { get; set; }
    public string? PlanningOfficer { get; set; }
    public string? CaseOfficerEmail { get; set; }
    public string? Ward { get; set; }
    public string? SiteAddress { get; set; }
    public decimal? ApplicationFee { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
    public ICollection<PlanningCondition> Conditions { get; set; } = new List<PlanningCondition>();
    public ICollection<PlanningAppeal> Appeals { get; set; } = new List<PlanningAppeal>();
    public ICollection<PlanningDocument> Documents { get; set; } = new List<PlanningDocument>();
}
