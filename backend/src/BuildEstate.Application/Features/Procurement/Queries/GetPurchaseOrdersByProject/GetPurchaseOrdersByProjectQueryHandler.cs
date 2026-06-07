using BuildEstate.Application.Features.Procurement.DTOs;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Procurement.Queries.GetPurchaseOrdersByProject;
public class GetPurchaseOrdersByProjectQueryHandler : IRequestHandler<GetPurchaseOrdersByProjectQuery, List<PurchaseOrderDto>>
{
    private readonly IRepository<PurchaseOrder> _repository;
    public GetPurchaseOrdersByProjectQueryHandler(IRepository<PurchaseOrder> repository) { _repository = repository; }
    public async Task<List<PurchaseOrderDto>> Handle(GetPurchaseOrdersByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderByDescending(x => x.OrderDate)
            .Select(x => new PurchaseOrderDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                OrderReference = x.OrderReference,
                SupplierName = x.SupplierName,
                SupplierContact = x.SupplierContact,
                Description = x.Description,
                Status = x.Status,
                TotalValue = x.TotalValue,
                Currency = x.Currency,
                OrderDate = x.OrderDate,
                ExpectedDeliveryDate = x.ExpectedDeliveryDate,
                ActualDeliveryDate = x.ActualDeliveryDate,
                ApprovedBy = x.ApprovedBy,
                Notes = x.Notes,
                DeliveryCount = x.Deliveries.Count,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
