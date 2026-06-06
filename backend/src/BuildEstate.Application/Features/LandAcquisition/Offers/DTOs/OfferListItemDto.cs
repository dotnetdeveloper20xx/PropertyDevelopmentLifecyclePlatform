using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;

/// <summary>
/// Lightweight DTO for offer list views.
/// </summary>
public record OfferListItemDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime OfferDate { get; init; }
    public DateTime? ValidUntil { get; init; }
    public OfferStatus Status { get; init; }
    public decimal? CounterOfferAmount { get; init; }
    public DateTime CreatedAt { get; init; }
}
