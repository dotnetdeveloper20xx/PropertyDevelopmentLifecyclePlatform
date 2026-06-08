using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Feasibility.DTOs;

public record FeasibilityAssessmentDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public FeasibilityStatus Status { get; init; }
    public decimal EstimatedLandCost { get; init; }
    public decimal EstimatedBuildCost { get; init; }
    public decimal ProfessionalFees { get; init; }
    public decimal FinanceCosts { get; init; }
    public decimal GrossDevelopmentValue { get; init; }
    public decimal ExpectedSalesRevenue { get; init; }
    public decimal EstimatedProfit { get; init; }
    public decimal ROI { get; init; }
    public string? Scenario { get; init; }
    public string? ApprovalNotes { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
