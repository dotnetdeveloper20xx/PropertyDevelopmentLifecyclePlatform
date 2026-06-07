using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Procurement;

/// <summary>
/// Represents a delivery against a purchase order.
/// </summary>
public class Delivery : BaseEntity
{
    public Guid PurchaseOrderId { get; set; }
    public string? DeliveryReference { get; set; }
    public DeliveryStatus Status { get; set; } = DeliveryStatus.Pending;
    public DateTime? DeliveryDate { get; set; }
    public string? ReceivedBy { get; set; }
    public string? Items { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
}
