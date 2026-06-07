using BuildEstate.Application.Features.Procurement.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Procurement.Queries.GetPurchaseOrdersByProject;
public record GetPurchaseOrdersByProjectQuery(Guid ProjectId) : IRequest<List<PurchaseOrderDto>>;
