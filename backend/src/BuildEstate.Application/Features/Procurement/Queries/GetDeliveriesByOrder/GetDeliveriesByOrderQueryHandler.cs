using BuildEstate.Application.Features.Procurement.DTOs;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Procurement.Queries.GetDeliveriesByOrder;
public class GetDeliveriesByOrderQueryHandler : IRequestHandler<GetDeliveriesByOrderQuery, List<DeliveryDto>>
{
    private readonly IRepository<Delivery> _repository;
    public GetDeliveriesByOrderQueryHandler(IRepository<Delivery> repository) { _repository = repository; }
    public async Task<List<DeliveryDto>> Handle(GetDeliveriesByOrderQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.PurchaseOrderId == request.PurchaseOrderId).OrderByDescending(x => x.CreatedAt)
            .Select(x => new DeliveryDto
            {
                Id = x.Id,
                PurchaseOrderId = x.PurchaseOrderId,
                DeliveryReference = x.DeliveryReference,
                Status = x.Status,
                DeliveryDate = x.DeliveryDate,
                ReceivedBy = x.ReceivedBy,
                Items = x.Items,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
