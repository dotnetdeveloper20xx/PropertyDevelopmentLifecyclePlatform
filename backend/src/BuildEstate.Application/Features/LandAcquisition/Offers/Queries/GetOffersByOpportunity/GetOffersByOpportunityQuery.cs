using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Queries.GetOffersByOpportunity;

/// <summary>
/// Query to retrieve all offers for a specific opportunity.
/// </summary>
public record GetOffersByOpportunityQuery(Guid OpportunityId) : IRequest<List<OfferListItemDto>>;
