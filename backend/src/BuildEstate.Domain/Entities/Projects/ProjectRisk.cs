using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Projects;

/// <summary>
/// Represents a risk or issue identified in a project.
/// </summary>
public class ProjectRisk : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public RiskStatus Status { get; set; } = RiskStatus.Open;
    public RiskImpact Impact { get; set; } = RiskImpact.Medium;
    public RiskProbability Probability { get; set; } = RiskProbability.Medium;
    public string? MitigationPlan { get; set; }
    public string? Owner { get; set; }
    public DateTime? IdentifiedDate { get; set; }
    public DateTime? ResolvedDate { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
}
