using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.LandAcquisition;

/// <summary>
/// Represents the completed acquisition of a land opportunity.
/// </summary>
public class LandAcquisitionRecord : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; } = "GBP";
    public DateTime CompletionDate { get; set; }
    public string? RegistryReference { get; set; }
    public AcquisitionStatus Status { get; set; } = AcquisitionStatus.InProgress;
    public string? SolicitorName { get; set; }
    public string? SolicitorContact { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
}
