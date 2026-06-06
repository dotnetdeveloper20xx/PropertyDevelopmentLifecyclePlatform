using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.LandAcquisition;

/// <summary>
/// Represents a land acquisition opportunity in the pipeline.
/// </summary>
public class LandOpportunity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? PostCode { get; set; }
    public decimal LandSize { get; set; }
    public string? LandSizeUnit { get; set; } = "Acres";
    public string? CurrentUse { get; set; }
    public string? TitleNumber { get; set; }
    public string? PlanningStatus { get; set; }
    public string? LocalPlanZoning { get; set; }
    public string? PlanningPotential { get; set; }
    public OpportunityStatus Status { get; set; } = OpportunityStatus.Identified;
    public string? Source { get; set; }
    public string? AgentName { get; set; }
    public string? AgentContact { get; set; }
    public decimal? AskingPrice { get; set; }
    public decimal? EstimatedValue { get; set; }
    public decimal? EstimatedDevelopmentCost { get; set; }
    public decimal? EstimatedProfit { get; set; }
    public decimal? ROI { get; set; }
    public DateTime? ExpectedAcquisitionDate { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public Guid? LandOwnerId { get; set; }
    public LandOwner? LandOwner { get; set; }
    public ICollection<DueDiligence> DueDiligences { get; set; } = new List<DueDiligence>();
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public LandAcquisitionRecord? Acquisition { get; set; }
}
