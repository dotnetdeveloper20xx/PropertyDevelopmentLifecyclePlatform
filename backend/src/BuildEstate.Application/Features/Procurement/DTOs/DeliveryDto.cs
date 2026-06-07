using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Procurement.DTOs;
public record DeliveryDto
{
    public Guid Id { get; init; }
    public Guid PurchaseOrderId { get; init; }
    public string? DeliveryReference { get; init; }
    public DeliveryStatus Status { get; init; }
    public DateTime? DeliveryDate { get; init; }
    public string? ReceivedBy { get; init; }
    public string? Items { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
