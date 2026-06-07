using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Projects.Queries.GetRisksByProject;
public class GetRisksByProjectQueryHandler : IRequestHandler<GetRisksByProjectQuery, List<ProjectRiskDto>>
{
    private readonly IRepository<ProjectRisk> _repository;
    public GetRisksByProjectQueryHandler(IRepository<ProjectRisk> repository) { _repository = repository; }
    public async Task<List<ProjectRiskDto>> Handle(GetRisksByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderByDescending(x => x.Impact).ThenByDescending(x => x.Probability)
            .Select(x => new ProjectRiskDto { Id = x.Id, ProjectId = x.ProjectId, Title = x.Title, Description = x.Description, Status = x.Status, Impact = x.Impact, Probability = x.Probability, MitigationPlan = x.MitigationPlan, Owner = x.Owner, IdentifiedDate = x.IdentifiedDate, ResolvedDate = x.ResolvedDate, Notes = x.Notes, CreatedAt = x.CreatedAt })
            .ToListAsync(cancellationToken);
    }
}
