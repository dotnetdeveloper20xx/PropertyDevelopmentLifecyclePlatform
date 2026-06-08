using BuildEstate.Application.Features.Feasibility.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Feasibility.Commands.CreateFeasibility;

public record CreateFeasibilityCommand : IRequest<FeasibilityAssessmentDto>
{
    public Guid OpportunityId { get; init; }
    public decimal EstimatedLandCost { get; init; }
    public decimal EstimatedBuildCost { get; init; }
    public decimal ProfessionalFees { get; init; }
    public decimal FinanceCosts { get; init; }
    public decimal GrossDevelopmentValue { get; init; }
    public decimal ExpectedSalesRevenue { get; init; }
    public string? Scenario { get; init; }
    public string? Notes { get; init; }
}
