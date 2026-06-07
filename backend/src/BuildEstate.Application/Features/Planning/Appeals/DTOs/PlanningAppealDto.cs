using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Planning.Appeals.DTOs;

public record PlanningAppealDto
{
    public Guid Id { get; init; }
    public Guid PlanningApplicationId { get; init; }
    public string AppealReference { get; init; } = string.Empty;
    public AppealStatus Status { get; init; }
    public DateTime AppealDate { get; init; }
    public DateTime? HearingDate { get; init; }
    public DateTime? DecisionDate { get; init; }
    public string? Inspector { get; init; }
    public string? Grounds { get; init; }
    public string? Decision { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
