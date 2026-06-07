using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Legal;

/// <summary>
/// Represents a legal task (action item) that needs to be completed.
/// </summary>
public class LegalTask : BaseEntity
{
    public Guid? ContractId { get; set; }
    public Guid? OpportunityId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public LegalTaskPriority Priority { get; set; } = LegalTaskPriority.Medium;
    public LegalTaskStatus Status { get; set; } = LegalTaskStatus.Open;
    public string? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public Contract? Contract { get; set; }
}
