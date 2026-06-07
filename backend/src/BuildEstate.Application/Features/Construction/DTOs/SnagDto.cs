using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Construction.DTOs;
public record SnagDto
{
    public Guid Id { get; init; }
    public Guid ConstructionStageId { get; init; }
    public Guid? InspectionId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public SnagStatus Status { get; init; }
    public SnagPriority Priority { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? ResolvedDate { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
