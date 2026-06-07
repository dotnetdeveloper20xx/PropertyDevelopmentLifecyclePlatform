using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Construction;

/// <summary>
/// Represents a site inspection record.
/// </summary>
public class Inspection : BaseEntity
{
    public Guid ConstructionStageId { get; set; }
    public InspectionType Type { get; set; }
    public InspectionStatus Status { get; set; } = InspectionStatus.Scheduled;
    public string? Inspector { get; set; }
    public DateTime ScheduledDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string? Findings { get; set; }
    public int DefectsFound { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public ConstructionStage ConstructionStage { get; set; } = null!;
}
