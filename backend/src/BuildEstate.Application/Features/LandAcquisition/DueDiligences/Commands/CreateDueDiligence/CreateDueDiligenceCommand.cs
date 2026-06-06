using BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.CreateDueDiligence;

/// <summary>
/// Command to create a new due diligence check for an opportunity.
/// </summary>
public record CreateDueDiligenceCommand : IRequest<DueDiligenceListItemDto>
{
    public Guid OpportunityId { get; init; }
    public DueDiligenceType Type { get; init; }
    public string? AssignedTo { get; init; }
    public string? Notes { get; init; }
}
