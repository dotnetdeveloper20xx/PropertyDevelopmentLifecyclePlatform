using BuildEstate.Application.Features.Projects.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Commands.CreateMilestone;
public record CreateMilestoneCommand : IRequest<MilestoneDto>
{
    public Guid ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTime TargetDate { get; init; }
    public string? Notes { get; init; }
}
