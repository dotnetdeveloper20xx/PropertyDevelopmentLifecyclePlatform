using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.ChangeComplianceStatus;

public record ChangeComplianceStatusCommand : IRequest
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public ComplianceCheckStatus NewStatus { get; init; }
    public string? Outcome { get; init; }
    public RiskLevel? RiskLevel { get; init; }
}
