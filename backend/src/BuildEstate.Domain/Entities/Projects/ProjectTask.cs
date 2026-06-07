using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Projects;

/// <summary>
/// Represents a task within a project — an actionable work item.
/// </summary>
public class ProjectTask : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Guid? MilestoneId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectTaskStatus Status { get; set; } = ProjectTaskStatus.NotStarted;
    public ProjectTaskPriority Priority { get; set; } = ProjectTaskPriority.Medium;
    public string? AssignedTo { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public decimal? ProgressPercent { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public Milestone? Milestone { get; set; }
}
