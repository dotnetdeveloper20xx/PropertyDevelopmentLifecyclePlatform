using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Planning.Conditions.DTOs;

public record PlanningConditionDto
{
    public Guid Id { get; init; }
    public Guid PlanningApplicationId { get; init; }
    public int ConditionNumber { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public PlanningConditionStatus Status { get; init; }
    public DateTime? DueDate { get; init; }
    public DateTime? DischargeDate { get; init; }
    public string? DischargeReference { get; init; }
    public string? AssignedTo { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
