using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Projects.Queries.GetTasksByProject;
public class GetTasksByProjectQueryHandler : IRequestHandler<GetTasksByProjectQuery, List<ProjectTaskDto>>
{
    private readonly IRepository<ProjectTask> _repository;
    public GetTasksByProjectQueryHandler(IRepository<ProjectTask> repository) { _repository = repository; }
    public async Task<List<ProjectTaskDto>> Handle(GetTasksByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderByDescending(x => x.Priority).ThenBy(x => x.DueDate)
            .Select(x => new ProjectTaskDto { Id = x.Id, ProjectId = x.ProjectId, MilestoneId = x.MilestoneId, Title = x.Title, Description = x.Description, Status = x.Status, Priority = x.Priority, AssignedTo = x.AssignedTo, StartDate = x.StartDate, DueDate = x.DueDate, CompletedDate = x.CompletedDate, ProgressPercent = x.ProgressPercent, Notes = x.Notes, CreatedAt = x.CreatedAt })
            .ToListAsync(cancellationToken);
    }
}
