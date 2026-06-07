using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Procurement.DTOs;
public record PurchaseOrderDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string OrderReference { get; init; } = string.Empty;
    public string SupplierName { get; init; } = string.Empty;
    public string? SupplierContact { get; init; }
    public string? Description { get; init; }
    public PurchaseOrderStatus Status { get; init; }
    public decimal TotalValue { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime OrderDate { get; init; }
    public DateTime? ExpectedDeliveryDate { get; init; }
    public DateTime? ActualDeliveryDate { get; init; }
    public string? ApprovedBy { get; init; }
    public string? Notes { get; init; }
    public int DeliveryCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
