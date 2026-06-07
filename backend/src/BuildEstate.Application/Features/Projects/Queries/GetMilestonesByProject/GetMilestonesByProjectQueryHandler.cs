using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Projects.Queries.GetMilestonesByProject;
public class GetMilestonesByProjectQueryHandler : IRequestHandler<GetMilestonesByProjectQuery, List<MilestoneDto>>
{
    private readonly IRepository<Milestone> _repository;
    public GetMilestonesByProjectQueryHandler(IRepository<Milestone> repository) { _repository = repository; }
    public async Task<List<MilestoneDto>> Handle(GetMilestonesByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderBy(x => x.SortOrder)
            .Select(x => new MilestoneDto { Id = x.Id, ProjectId = x.ProjectId, Title = x.Title, Description = x.Description, Status = x.Status, TargetDate = x.TargetDate, CompletedDate = x.CompletedDate, SortOrder = x.SortOrder, Notes = x.Notes, CreatedAt = x.CreatedAt })
            .ToListAsync(cancellationToken);
    }
}
