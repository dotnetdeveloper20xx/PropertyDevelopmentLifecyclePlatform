using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Construction.Queries.GetInspectionsByStage;
public class GetInspectionsByStageQueryHandler : IRequestHandler<GetInspectionsByStageQuery, List<InspectionDto>>
{
    private readonly IRepository<Inspection> _repository;
    public GetInspectionsByStageQueryHandler(IRepository<Inspection> repository) { _repository = repository; }
    public async Task<List<InspectionDto>> Handle(GetInspectionsByStageQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ConstructionStageId == request.StageId).OrderByDescending(x => x.ScheduledDate)
            .Select(x => new InspectionDto
            {
                Id = x.Id,
                ConstructionStageId = x.ConstructionStageId,
                Type = x.Type,
                Status = x.Status,
                Inspector = x.Inspector,
                ScheduledDate = x.ScheduledDate,
                CompletedDate = x.CompletedDate,
                Findings = x.Findings,
                DefectsFound = x.DefectsFound,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
