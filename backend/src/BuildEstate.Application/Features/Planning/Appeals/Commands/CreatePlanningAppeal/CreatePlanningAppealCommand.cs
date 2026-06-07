using BuildEstate.Application.Features.Planning.Appeals.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Appeals.Commands.CreatePlanningAppeal;

/// <summary>
/// Command to create a new appeal for a planning application.
/// </summary>
public record CreatePlanningAppealCommand : IRequest<PlanningAppealDto>
{
    public Guid PlanningApplicationId { get; init; }
    public string AppealReference { get; init; } = string.Empty;
    public DateTime? HearingDate { get; init; }
    public string? Inspector { get; init; }
    public string? Grounds { get; init; }
    public string? Notes { get; init; }
}
