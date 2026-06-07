using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Sales;

public class SalesLead : BaseEntity
{
    public Guid? ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Source { get; set; }
    public LeadStatus Status { get; set; } = LeadStatus.New;
    public string? InterestDetails { get; set; }
    public decimal? Budget { get; set; }
    public string? Notes { get; set; }
}
