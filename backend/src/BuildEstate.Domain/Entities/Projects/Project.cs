using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Projects;

/// <summary>
/// Represents a development project. The central entity that ties land acquisition
/// through to construction, sales, and completion.
/// </summary>
public class Project : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ProjectReference { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
    public string? ProjectManager { get; set; }
    public string? SiteAddress { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? TargetEndDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    public decimal? Budget { get; set; }
    public decimal? ActualCost { get; set; }
    public int? TotalUnits { get; set; }
    public decimal? ProgressPercent { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
    public ICollection<Milestone> Milestones { get; set; } = new List<Milestone>();
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    public ICollection<ProjectRisk> Risks { get; set; } = new List<ProjectRisk>();
}
