using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Defects.DTOs;

public record DefectDto
{
    public Guid Id { get; init; }
    public Guid? PropertyUnitId { get; init; }
    public Guid? ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DefectStatus Status { get; init; }
    public DefectPriority Priority { get; init; }
    public string? ReportedBy { get; init; }
    public DateTime ReportedDate { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? ResolvedDate { get; init; }
    public string? Resolution { get; init; }
    public bool UnderWarranty { get; init; }
    public string? WarrantyReference { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
