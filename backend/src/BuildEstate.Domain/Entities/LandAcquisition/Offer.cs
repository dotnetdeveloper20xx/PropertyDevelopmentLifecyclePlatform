using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.LandAcquisition;

/// <summary>
/// Represents an offer made on a land opportunity.
/// </summary>
public class Offer : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "GBP";
    public DateTime OfferDate { get; set; } = DateTime.UtcNow;
    public DateTime? ValidUntil { get; set; }
    public OfferStatus Status { get; set; } = OfferStatus.UnderReview;
    public decimal? CounterOfferAmount { get; set; }
    public string? Conditions { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
}
