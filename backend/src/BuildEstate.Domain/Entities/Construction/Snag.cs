using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Construction;

/// <summary>
/// Represents a snagging item (defect) found during inspection or handover.
/// </summary>
public class Snag : BaseEntity
{
    public Guid ConstructionStageId { get; set; }
    public Guid? InspectionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public SnagStatus Status { get; set; } = SnagStatus.Open;
    public SnagPriority Priority { get; set; } = SnagPriority.Medium;
    public string? AssignedTo { get; set; }
    public DateTime? ResolvedDate { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public ConstructionStage ConstructionStage { get; set; } = null!;
    public Inspection? Inspection { get; set; }
}
