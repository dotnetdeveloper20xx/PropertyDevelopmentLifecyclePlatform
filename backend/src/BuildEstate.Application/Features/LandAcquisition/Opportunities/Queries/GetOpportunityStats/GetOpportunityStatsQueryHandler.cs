using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityStats;

/// <summary>
/// Handles retrieval of pipeline statistics.
/// Uses SQL-level aggregation (SUM, AVG, COUNT) — never loads all records into memory.
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

        // Single round-trip: status counts via GroupBy
        var statusCounts = await query
            .GroupBy(x => x.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        // SQL-level aggregation for financials — never loads rows into memory
        var totalPipelineValue = await query
            .Where(x => x.AskingPrice.HasValue)
            .SumAsync(x => x.AskingPrice!.Value, cancellationToken);

        var averageAskingPrice = await query
            .Where(x => x.AskingPrice.HasValue)
            .Select(x => (decimal?)x.AskingPrice!.Value)
            .AverageAsync(cancellationToken);

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
            TotalPipelineValue = totalPipelineValue,
            AverageAskingPrice = averageAskingPrice
        };
    }
}
