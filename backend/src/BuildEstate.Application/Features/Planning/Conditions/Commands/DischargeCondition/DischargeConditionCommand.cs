using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Conditions.Commands.DischargeCondition;

/// <summary>
/// Command to discharge (or partially discharge) a planning condition.
/// </summary>
public record DischargeConditionCommand : IRequest<PlanningConditionDto>
{
    public Guid Id { get; init; }
    public Guid PlanningApplicationId { get; init; }
    public bool PartialDischarge { get; init; }
    public string? DischargeReference { get; init; }
    public string? Notes { get; init; }
}
