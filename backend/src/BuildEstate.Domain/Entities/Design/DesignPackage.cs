using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Design;

public class DesignPackage : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Discipline { get; set; }
    public DesignStageStatus Status { get; set; } = DesignStageStatus.Draft;
    public string? Consultant { get; set; }
    public string? ConsultantEmail { get; set; }
    public int Version { get; set; } = 1;
    public DateTime? SubmittedDate { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public string? ApprovedBy { get; set; }
    public string? Notes { get; set; }

    public Project Project { get; set; } = null!;
}
