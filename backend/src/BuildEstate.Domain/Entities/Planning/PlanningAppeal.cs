using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Planning;

/// <summary>
/// Represents an appeal against a refused planning application.
/// </summary>
public class PlanningAppeal : BaseEntity
{
    public Guid PlanningApplicationId { get; set; }
    public string AppealReference { get; set; } = string.Empty;
    public AppealStatus Status { get; set; } = AppealStatus.Submitted;
    public DateTime AppealDate { get; set; } = DateTime.UtcNow;
    public DateTime? HearingDate { get; set; }
    public DateTime? DecisionDate { get; set; }
    public string? Inspector { get; set; }
    public string? Grounds { get; set; }
    public string? Decision { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public PlanningApplication PlanningApplication { get; set; } = null!;
}
