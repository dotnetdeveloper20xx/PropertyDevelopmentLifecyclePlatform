using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;

/// <summary>
/// Lightweight DTO for opportunity list views. Contains only the fields
/// needed for pipeline boards and summary tables.
/// </summary>
public record OpportunityListItemDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Location { get; init; } = string.Empty;
    public decimal LandSize { get; init; }
    public string? LandSizeUnit { get; init; }
    public OpportunityStatus Status { get; init; }
    public decimal? AskingPrice { get; init; }
    public decimal? ROI { get; init; }
    public string? Source { get; init; }
    public DateTime? ExpectedAcquisitionDate { get; init; }
    public DateTime CreatedAt { get; init; }
}
