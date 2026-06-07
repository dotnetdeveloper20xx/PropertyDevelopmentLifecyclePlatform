using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProjectTask;
public record CreateProjectTaskCommand : IRequest<ProjectTaskDto>
{
    public Guid ProjectId { get; init; }
    public Guid? MilestoneId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public ProjectTaskPriority Priority { get; init; } = ProjectTaskPriority.Medium;
    public string? AssignedTo { get; init; }
    public DateTime? DueDate { get; init; }
    public string? Notes { get; init; }
}
