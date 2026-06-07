using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Procurement;

/// <summary>
/// Represents a purchase order for materials or services.
/// </summary>
public class PurchaseOrder : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string OrderReference { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
    public string? SupplierContact { get; set; }
    public string? Description { get; set; }
    public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Draft;
    public decimal TotalValue { get; set; }
    public string Currency { get; set; } = "GBP";
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedDeliveryDate { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }
    public string? ApprovedBy { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
}
