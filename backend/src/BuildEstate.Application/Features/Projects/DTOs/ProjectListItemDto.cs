using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Projects.DTOs;
public record ProjectListItemDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string ProjectReference { get; init; } = string.Empty;
    public ProjectStatus Status { get; init; }
    public string? ProjectManager { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? TargetEndDate { get; init; }
    public decimal? Budget { get; init; }
    public decimal? ProgressPercent { get; init; }
    public int? TotalUnits { get; init; }
    public int MilestoneCount { get; init; }
    public int TaskCount { get; init; }
    public int RiskCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
