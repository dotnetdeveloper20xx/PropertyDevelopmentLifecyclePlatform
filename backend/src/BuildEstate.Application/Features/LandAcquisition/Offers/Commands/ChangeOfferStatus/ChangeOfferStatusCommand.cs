using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Commands.ChangeOfferStatus;

/// <summary>
/// Command to change an offer's status (Accept, Reject, Counter-Offer, Withdraw).
/// </summary>
public record ChangeOfferStatusCommand : IRequest<OfferListItemDto>
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public OfferStatus NewStatus { get; init; }
    public decimal? CounterOfferAmount { get; init; }
    public string? Notes { get; init; }
}
