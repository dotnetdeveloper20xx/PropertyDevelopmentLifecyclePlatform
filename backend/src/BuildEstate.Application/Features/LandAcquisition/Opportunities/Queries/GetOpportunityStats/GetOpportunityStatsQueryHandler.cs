using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityStats;

/// <summary>
/// Handles retrieval of pipeline statistics. Single DB round trip using GroupBy.
/// </summary>
public class GetOpportunityStatsQueryHandler : IRequestHandler<GetOpportunityStatsQuery, OpportunityStatsDto>
{
    private readonly IRepository<LandOpportunity> _repository;

    public GetOpportunityStatsQueryHandler(IRepository<LandOpportunity> repository)
    {
        _repository = repository;
    }

    public async Task<OpportunityStatsDto> Handle(
        GetOpportunityStatsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        var statusCounts = await query
            .GroupBy(x => x.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var financials = await query
            .Where(x => x.AskingPrice.HasValue)
            .Select(x => x.AskingPrice!.Value)
            .ToListAsync(cancellationToken);

        return new OpportunityStatsDto
        {
            TotalOpportunities = statusCounts.Sum(x => x.Count),
            Identified = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.Identified)?.Count ?? 0,
            InitialReview = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.InitialReview)?.Count ?? 0,
            DueDiligence = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.DueDiligence)?.Count ?? 0,
            OfferMade = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.OfferMade)?.Count ?? 0,
            UnderContract = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.UnderContract)?.Count ?? 0,
            Acquired = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.Acquired)?.Count ?? 0,
            Withdrawn = statusCounts.FirstOrDefault(x => x.Status == OpportunityStatus.Withdrawn)?.Count ?? 0,
            TotalPipelineValue = financials.Sum(),
            AverageAskingPrice = financials.Count > 0 ? financials.Average() : null
        };
    }
}
