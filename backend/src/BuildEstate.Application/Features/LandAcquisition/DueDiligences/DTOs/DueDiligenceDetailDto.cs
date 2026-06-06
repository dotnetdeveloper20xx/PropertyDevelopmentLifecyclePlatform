using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;

/// <summary>
/// Full detail DTO for individual due diligence views.
/// </summary>
public record DueDiligenceDetailDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public DueDiligenceType Type { get; init; }
    public DueDiligenceStatus Status { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? ReportDate { get; init; }
    public string? Findings { get; init; }
    public string? Recommendation { get; init; }
    public string? RiskLevel { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
    public DateTime? UpdatedAt { get; init; }
}
