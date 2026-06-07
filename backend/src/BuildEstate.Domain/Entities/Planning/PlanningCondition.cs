using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Planning;

/// <summary>
/// Represents a condition attached to an approved planning application.
/// Conditions must be discharged before development can proceed.
/// </summary>
public class PlanningCondition : BaseEntity
{
    public Guid PlanningApplicationId { get; set; }
    public int ConditionNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PlanningConditionStatus Status { get; set; } = PlanningConditionStatus.Pending;
    public DateTime? DueDate { get; set; }
    public DateTime? DischargeDate { get; set; }
    public string? DischargeReference { get; set; }
    public string? AssignedTo { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public PlanningApplication PlanningApplication { get; set; } = null!;
}
