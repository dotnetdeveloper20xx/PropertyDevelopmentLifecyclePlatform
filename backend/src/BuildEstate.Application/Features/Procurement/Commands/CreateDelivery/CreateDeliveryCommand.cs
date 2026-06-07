using BuildEstate.Application.Features.Procurement.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Procurement.Commands.CreateDelivery;
public record CreateDeliveryCommand : IRequest<DeliveryDto>
{
    public Guid PurchaseOrderId { get; init; }
    public string? DeliveryReference { get; init; }
    public DateTime? DeliveryDate { get; init; }
    public string? ReceivedBy { get; init; }
    public string? Items { get; init; }
    public string? Notes { get; init; }
}
