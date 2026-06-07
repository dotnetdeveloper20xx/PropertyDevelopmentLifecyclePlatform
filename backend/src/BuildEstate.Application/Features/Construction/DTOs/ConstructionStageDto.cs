using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Construction.DTOs;
public record ConstructionStageDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public ConstructionStageStatus Status { get; init; }
    public int SortOrder { get; init; }
    public DateTime? PlannedStartDate { get; init; }
    public DateTime? PlannedEndDate { get; init; }
    public DateTime? ActualStartDate { get; init; }
    public DateTime? ActualEndDate { get; init; }
    public decimal? ProgressPercent { get; init; }
    public string? Notes { get; init; }
    public int InspectionCount { get; init; }
    public int SnagCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
