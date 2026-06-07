using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Rentals;

public class Tenancy : BaseEntity
{
    public Guid PropertyUnitId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public string? TenantEmail { get; set; }
    public string? TenantPhone { get; set; }
    public decimal MonthlyRent { get; set; }
    public DateTime LeaseStartDate { get; set; }
    public DateTime LeaseEndDate { get; set; }
    public TenancyStatus Status { get; set; } = TenancyStatus.Active;
    public string? Notes { get; set; }

    public PropertyUnit PropertyUnit { get; set; } = null!;
}
