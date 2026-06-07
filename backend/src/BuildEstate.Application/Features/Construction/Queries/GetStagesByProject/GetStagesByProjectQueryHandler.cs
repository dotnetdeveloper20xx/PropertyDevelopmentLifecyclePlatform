using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Construction.Queries.GetStagesByProject;
public class GetStagesByProjectQueryHandler : IRequestHandler<GetStagesByProjectQuery, List<ConstructionStageDto>>
{
    private readonly IRepository<ConstructionStage> _repository;
    public GetStagesByProjectQueryHandler(IRepository<ConstructionStage> repository) { _repository = repository; }
    public async Task<List<ConstructionStageDto>> Handle(GetStagesByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderBy(x => x.SortOrder)
            .Select(x => new ConstructionStageDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Name = x.Name,
                Description = x.Description,
                Status = x.Status,
                SortOrder = x.SortOrder,
                PlannedStartDate = x.PlannedStartDate,
                PlannedEndDate = x.PlannedEndDate,
                ActualStartDate = x.ActualStartDate,
                ActualEndDate = x.ActualEndDate,
                ProgressPercent = x.ProgressPercent,
                Notes = x.Notes,
                InspectionCount = x.Inspections.Count,
                SnagCount = x.Snags.Count,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
