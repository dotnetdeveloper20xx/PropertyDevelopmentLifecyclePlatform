using BuildEstate.Application.Features.Projects.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProject;
public record CreateProjectCommand : IRequest<CreateProjectDto>
{
    public Guid OpportunityId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string ProjectReference { get; init; } = string.Empty;
    public string? ProjectManager { get; init; }
    public string? SiteAddress { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? TargetEndDate { get; init; }
    public decimal? Budget { get; init; }
    public int? TotalUnits { get; init; }
    public string? Notes { get; init; }
}
