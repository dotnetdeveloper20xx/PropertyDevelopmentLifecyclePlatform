using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Projects.DTOs;
public record MilestoneDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public MilestoneStatus Status { get; init; }
    public DateTime TargetDate { get; init; }
    public DateTime? CompletedDate { get; init; }
    public int SortOrder { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
