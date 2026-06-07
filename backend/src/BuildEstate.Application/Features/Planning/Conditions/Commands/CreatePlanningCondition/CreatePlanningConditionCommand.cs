using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Conditions.Commands.CreatePlanningCondition;

/// <summary>
/// Command to create a new planning condition for an application.
/// </summary>
public record CreatePlanningConditionCommand : IRequest<PlanningConditionDto>
{
    public Guid PlanningApplicationId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime? DueDate { get; init; }
    public string? AssignedTo { get; init; }
    public string? Notes { get; init; }
}
