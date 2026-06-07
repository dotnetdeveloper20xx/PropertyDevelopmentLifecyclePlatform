using BuildEstate.Application.Features.Procurement.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Procurement.Queries.GetDeliveriesByOrder;
public record GetDeliveriesByOrderQuery(Guid PurchaseOrderId) : IRequest<List<DeliveryDto>>;
