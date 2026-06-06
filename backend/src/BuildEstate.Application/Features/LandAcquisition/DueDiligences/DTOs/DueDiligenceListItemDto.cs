using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;

/// <summary>
/// Lightweight DTO for due diligence list views.
/// </summary>
public record DueDiligenceListItemDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public DueDiligenceType Type { get; init; }
    public DueDiligenceStatus Status { get; init; }
    public string? AssignedTo { get; init; }
    public string? RiskLevel { get; init; }
    public DateTime? ReportDate { get; init; }
    public DateTime CreatedAt { get; init; }
}
