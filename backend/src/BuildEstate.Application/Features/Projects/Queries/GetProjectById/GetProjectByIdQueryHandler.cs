using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Projects.Queries.GetProjectById;
public class GetProjectByIdQueryHandler : IRequestHandler<GetProjectByIdQuery, ProjectDetailDto>
{
    private readonly IRepository<Project> _repository;
    public GetProjectByIdQueryHandler(IRepository<Project> repository) { _repository = repository; }
    public async Task<ProjectDetailDto> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var dto = await _repository.Query().AsNoTracking().Where(x => x.Id == request.Id)
            .Select(x => new ProjectDetailDto
            {
                Id = x.Id, OpportunityId = x.OpportunityId, OpportunityName = x.Opportunity.Name,
                Name = x.Name, Description = x.Description, ProjectReference = x.ProjectReference,
                Status = x.Status, ProjectManager = x.ProjectManager, SiteAddress = x.SiteAddress,
                StartDate = x.StartDate, TargetEndDate = x.TargetEndDate, ActualEndDate = x.ActualEndDate,
                Budget = x.Budget, ActualCost = x.ActualCost, TotalUnits = x.TotalUnits,
                ProgressPercent = x.ProgressPercent, Notes = x.Notes,
                MilestoneCount = x.Milestones.Count(m => !m.IsDeleted),
                TaskCount = x.Tasks.Count(t => !t.IsDeleted),
                RiskCount = x.Risks.Count(r => !r.IsDeleted),
                CreatedAt = x.CreatedAt, CreatedBy = x.CreatedBy, UpdatedAt = x.UpdatedAt
            }).FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException(nameof(Project), request.Id);
        return dto;
    }
}
