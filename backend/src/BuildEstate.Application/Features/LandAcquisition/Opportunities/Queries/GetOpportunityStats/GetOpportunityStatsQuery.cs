using BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityStats;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityStats;

/// <summary>
/// Query to retrieve pipeline statistics for the opportunities dashboard.
/// </summary>
public record GetOpportunityStatsQuery : IRequest<OpportunityStatsDto>;

/// <summary>
/// Dashboard statistics for the opportunity pipeline.
/// </summary>
public record OpportunityStatsDto
{
    public int TotalOpportunities { get; init; }
    public int Identified { get; init; }
    public int InitialReview { get; init; }
    public int DueDiligence { get; init; }
    public int OfferMade { get; init; }
    public int UnderContract { get; init; }
    public int Acquired { get; init; }
    public int Withdrawn { get; init; }
    public decimal TotalPipelineValue { get; init; }
    public decimal? AverageAskingPrice { get; init; }
}
