using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Construction;

/// <summary>
/// Represents a construction stage/phase within a project (e.g., Foundations, Superstructure, Fit-Out).
/// </summary>
public class ConstructionStage : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ConstructionStageStatus Status { get; set; } = ConstructionStageStatus.NotStarted;
    public int SortOrder { get; set; }
    public DateTime? PlannedStartDate { get; set; }
    public DateTime? PlannedEndDate { get; set; }
    public DateTime? ActualStartDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    public decimal? ProgressPercent { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public ICollection<Inspection> Inspections { get; set; } = new List<Inspection>();
    public ICollection<Snag> Snags { get; set; } = new List<Snag>();
}
