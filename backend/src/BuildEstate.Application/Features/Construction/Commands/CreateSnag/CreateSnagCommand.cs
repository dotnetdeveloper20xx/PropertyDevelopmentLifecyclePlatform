using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Construction.Commands.CreateSnag;
public record CreateSnagCommand : IRequest<SnagDto>
{
    public Guid ConstructionStageId { get; init; }
    public Guid? InspectionId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public SnagPriority Priority { get; init; }
    public string? AssignedTo { get; init; }
    public string? Notes { get; init; }
}
