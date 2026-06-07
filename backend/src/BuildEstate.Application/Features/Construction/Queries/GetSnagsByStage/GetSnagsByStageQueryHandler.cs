using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Construction.Queries.GetSnagsByStage;
public class GetSnagsByStageQueryHandler : IRequestHandler<GetSnagsByStageQuery, List<SnagDto>>
{
    private readonly IRepository<Snag> _repository;
    public GetSnagsByStageQueryHandler(IRepository<Snag> repository) { _repository = repository; }
    public async Task<List<SnagDto>> Handle(GetSnagsByStageQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ConstructionStageId == request.StageId).OrderByDescending(x => x.Priority).ThenByDescending(x => x.CreatedAt)
            .Select(x => new SnagDto
            {
                Id = x.Id,
                ConstructionStageId = x.ConstructionStageId,
                InspectionId = x.InspectionId,
                Title = x.Title,
                Description = x.Description,
                Location = x.Location,
                Status = x.Status,
                Priority = x.Priority,
                AssignedTo = x.AssignedTo,
                ResolvedDate = x.ResolvedDate,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
