using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Feasibility;

public class FeasibilityAssessment : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public FeasibilityStatus Status { get; set; } = FeasibilityStatus.Draft;
    public decimal EstimatedLandCost { get; set; }
    public decimal EstimatedBuildCost { get; set; }
    public decimal ProfessionalFees { get; set; }
    public decimal FinanceCosts { get; set; }
    public decimal GrossDevelopmentValue { get; set; }
    public decimal ExpectedSalesRevenue { get; set; }
    public decimal EstimatedProfit { get; set; }
    public decimal ROI { get; set; }
    public string? Scenario { get; set; }
    public string? ApprovalNotes { get; set; }
    public string? Notes { get; set; }

    public LandOpportunity Opportunity { get; set; } = null!;
}
