using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;

/// <summary>
/// Full detail DTO for individual opportunity views.
/// Includes all fields, owner info, and summary counts.
/// </summary>
public record OpportunityDetailDto
{
    public Guid Id { get; init; }
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
    public OpportunityStatus Status { get; init; }
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
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
    public DateTime? UpdatedAt { get; init; }

    // Owner summary
    public Guid? LandOwnerId { get; init; }
    public string? LandOwnerName { get; init; }

    // Related entity counts
    public int DueDiligenceCount { get; init; }
    public int OfferCount { get; init; }
    public int DocumentCount { get; init; }
}
