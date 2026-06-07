using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Construction.DTOs;
public record InspectionDto
{
    public Guid Id { get; init; }
    public Guid ConstructionStageId { get; init; }
    public InspectionType Type { get; init; }
    public InspectionStatus Status { get; init; }
    public string? Inspector { get; init; }
    public DateTime ScheduledDate { get; init; }
    public DateTime? CompletedDate { get; init; }
    public string? Findings { get; init; }
    public int DefectsFound { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
