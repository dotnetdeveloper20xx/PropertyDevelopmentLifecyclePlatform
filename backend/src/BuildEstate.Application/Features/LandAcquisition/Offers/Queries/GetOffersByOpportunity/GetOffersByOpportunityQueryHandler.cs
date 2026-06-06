using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Queries.GetOffersByOpportunity;

/// <summary>
/// Handles retrieval of all offers for a specific opportunity.
/// </summary>
public class GetOffersByOpportunityQueryHandler
    : IRequestHandler<GetOffersByOpportunityQuery, List<OfferListItemDto>>
{
    private readonly IRepository<Offer> _repository;

    public GetOffersByOpportunityQueryHandler(IRepository<Offer> repository)
    {
        _repository = repository;
    }

    public async Task<List<OfferListItemDto>> Handle(
        GetOffersByOpportunityQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .OrderByDescending(x => x.OfferDate)
            .Select(x => new OfferListItemDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                Amount = x.Amount,
                Currency = x.Currency,
                OfferDate = x.OfferDate,
                ValidUntil = x.ValidUntil,
                Status = x.Status,
                CounterOfferAmount = x.CounterOfferAmount,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
