using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Commands.CreateOffer;

/// <summary>
/// Command to create a new offer on a land opportunity.
/// </summary>
public record CreateOfferCommand : IRequest<OfferListItemDto>
{
    public Guid OpportunityId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime? ValidUntil { get; init; }
    public string? Conditions { get; init; }
    public string? Notes { get; init; }
}
