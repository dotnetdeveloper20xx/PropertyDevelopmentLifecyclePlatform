using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Projects;

/// <summary>
/// Represents a project milestone — a key deliverable or checkpoint.
/// </summary>
public class Milestone : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public MilestoneStatus Status { get; set; } = MilestoneStatus.Upcoming;
    public DateTime TargetDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public int SortOrder { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
}
