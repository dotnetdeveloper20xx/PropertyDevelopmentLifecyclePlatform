using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Construction.Commands.CreateInspection;
public record CreateInspectionCommand : IRequest<InspectionDto>
{
    public Guid ConstructionStageId { get; init; }
    public InspectionType Type { get; init; }
    public string? Inspector { get; init; }
    public DateTime ScheduledDate { get; init; }
    public string? Notes { get; init; }
}
