using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.UpdateDueDiligence;

/// <summary>
/// Command to update an existing due diligence check (findings, status, recommendation).
/// </summary>
public record UpdateDueDiligenceCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public DueDiligenceStatus Status { get; init; }
    public string? AssignedTo { get; init; }
    public string? Findings { get; init; }
    public string? Recommendation { get; init; }
    public string? RiskLevel { get; init; }
    public string? Notes { get; init; }
    public DateTime? ReportDate { get; init; }
}
