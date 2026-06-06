using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.CreateOpportunity;

/// <summary>
/// Command to create a new land opportunity in the pipeline.
/// Returns a CreateOpportunityDto with the generated ID.
/// </summary>
public record CreateOpportunityCommand : IRequest<CreateOpportunityDto>
{
    public string Name { get; init; } = string.Empty;
    public string Location { get; init; } = string.Empty;
    public string? Address { get; init; }
    public string? PostCode { get; init; }
    public decimal LandSize { get; init; }
    public string? LandSizeUnit { get; init; }
    public string? CurrentUse { get; init; }
    public string? TitleNumber { get; init; }
    public string? PlanningStatus { get; init; }
    public string? LocalPlanZoning { get; init; }
    public string? PlanningPotential { get; init; }
    public string? Source { get; init; }
    public string? AgentName { get; init; }
    public string? AgentContact { get; init; }
    public decimal? AskingPrice { get; init; }
    public decimal? EstimatedValue { get; init; }
    public decimal? EstimatedDevelopmentCost { get; init; }
    public decimal? EstimatedProfit { get; init; }
    public decimal? ROI { get; init; }
    public DateTime? ExpectedAcquisitionDate { get; init; }
    public string? Notes { get; init; }
    public Guid? LandOwnerId { get; init; }
}
