using BuildEstate.Application.Features.Legal.ComplianceChecks.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.CreateComplianceCheck;

public record CreateComplianceCheckCommand : IRequest<ComplianceCheckDto>
{
    public Guid OpportunityId { get; init; }
    public ComplianceCheckType CheckType { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? DueDate { get; init; }
    public string? Notes { get; init; }
}
