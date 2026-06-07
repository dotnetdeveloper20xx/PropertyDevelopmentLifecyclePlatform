using BuildEstate.Application.Features.Procurement.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Procurement.Commands.CreatePurchaseOrder;
public record CreatePurchaseOrderCommand : IRequest<PurchaseOrderDto>
{
    public Guid ProjectId { get; init; }
    public string OrderReference { get; init; } = string.Empty;
    public string SupplierName { get; init; } = string.Empty;
    public string? SupplierContact { get; init; }
    public string? Description { get; init; }
    public decimal TotalValue { get; init; }
    public string? Currency { get; init; }
    public DateTime? ExpectedDeliveryDate { get; init; }
    public string? Notes { get; init; }
}
