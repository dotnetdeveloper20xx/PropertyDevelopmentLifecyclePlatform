using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Defects;

public class Defect : BaseEntity
{
    public Guid? PropertyUnitId { get; set; }
    public Guid? ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DefectStatus Status { get; set; } = DefectStatus.Reported;
    public DefectPriority Priority { get; set; } = DefectPriority.Medium;
    public string? ReportedBy { get; set; }
    public DateTime ReportedDate { get; set; } = DateTime.UtcNow;
    public string? AssignedTo { get; set; }
    public DateTime? ResolvedDate { get; set; }
    public string? Resolution { get; set; }
    public bool UnderWarranty { get; set; }
    public string? WarrantyReference { get; set; }
    public string? Notes { get; set; }

    public PropertyUnit? PropertyUnit { get; set; }
}
