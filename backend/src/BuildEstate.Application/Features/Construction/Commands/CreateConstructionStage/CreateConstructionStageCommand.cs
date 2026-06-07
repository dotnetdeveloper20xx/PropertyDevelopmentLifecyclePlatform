using BuildEstate.Application.Features.Construction.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Construction.Commands.CreateConstructionStage;
public record CreateConstructionStageCommand : IRequest<ConstructionStageDto>
{
    public Guid ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTime? PlannedStartDate { get; init; }
    public DateTime? PlannedEndDate { get; init; }
    public string? Notes { get; init; }
}
