using BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Queries.GetDueDiligencesByOpportunity;

/// <summary>
/// Handles retrieval of all due diligence checks for a specific opportunity.
/// Uses projection for performance.
/// </summary>
public class GetDueDiligencesByOpportunityQueryHandler
    : IRequestHandler<GetDueDiligencesByOpportunityQuery, List<DueDiligenceListItemDto>>
{
    private readonly IRepository<DueDiligence> _repository;

    public GetDueDiligencesByOpportunityQueryHandler(IRepository<DueDiligence> repository)
    {
        _repository = repository;
    }

    public async Task<List<DueDiligenceListItemDto>> Handle(
        GetDueDiligencesByOpportunityQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new DueDiligenceListItemDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                Type = x.Type,
                Status = x.Status,
                AssignedTo = x.AssignedTo,
                RiskLevel = x.RiskLevel,
                ReportDate = x.ReportDate,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
