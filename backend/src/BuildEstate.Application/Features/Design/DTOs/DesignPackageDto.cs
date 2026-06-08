using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Design.DTOs;

public record DesignPackageDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Discipline { get; init; }
    public DesignStageStatus Status { get; init; }
    public string? Consultant { get; init; }
    public string? ConsultantEmail { get; init; }
    public int Version { get; init; }
    public DateTime? SubmittedDate { get; init; }
    public DateTime? ApprovedDate { get; init; }
    public string? ApprovedBy { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
