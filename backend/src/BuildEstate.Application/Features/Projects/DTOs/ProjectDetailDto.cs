using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Projects.DTOs;
public record ProjectDetailDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string OpportunityName { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string ProjectReference { get; init; } = string.Empty;
    public ProjectStatus Status { get; init; }
    public string? ProjectManager { get; init; }
    public string? SiteAddress { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? TargetEndDate { get; init; }
    public DateTime? ActualEndDate { get; init; }
    public decimal? Budget { get; init; }
    public decimal? ActualCost { get; init; }
    public int? TotalUnits { get; init; }
    public decimal? ProgressPercent { get; init; }
    public string? Notes { get; init; }
    public int MilestoneCount { get; init; }
    public int TaskCount { get; init; }
    public int RiskCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
    public DateTime? UpdatedAt { get; init; }
}
