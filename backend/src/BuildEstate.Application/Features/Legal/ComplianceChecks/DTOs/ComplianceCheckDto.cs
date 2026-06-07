using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.DTOs;

public record ComplianceCheckDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public ComplianceCheckType CheckType { get; init; }
    public ComplianceCheckStatus Status { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? DueDate { get; init; }
    public DateTime? CompletedDate { get; init; }
    public string? Outcome { get; init; }
    public RiskLevel? RiskLevel { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
