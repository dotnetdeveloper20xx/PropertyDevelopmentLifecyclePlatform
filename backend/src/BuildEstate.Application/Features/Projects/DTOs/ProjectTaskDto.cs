using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Projects.DTOs;
public record ProjectTaskDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public Guid? MilestoneId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public ProjectTaskStatus Status { get; init; }
    public ProjectTaskPriority Priority { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? DueDate { get; init; }
    public DateTime? CompletedDate { get; init; }
    public decimal? ProgressPercent { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
