using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.LandAcquisition;

/// <summary>
/// Represents the owner of a piece of land.
/// </summary>
public class LandOwner : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Address { get; set; }
    public OwnershipType OwnershipType { get; set; } = OwnershipType.Freehold;
    public string? CompanyName { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public ICollection<LandOpportunity> Opportunities { get; set; } = new List<LandOpportunity>();
}
