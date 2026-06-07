using BuildEstate.Application.Features.Procurement.DTOs;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Procurement.Commands.CreatePurchaseOrder;
public class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, PurchaseOrderDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<PurchaseOrder> _purchaseOrderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePurchaseOrderCommandHandler> _logger;
    public CreatePurchaseOrderCommandHandler(IRepository<Project> projectRepository, IRepository<PurchaseOrder> purchaseOrderRepository, IUnitOfWork unitOfWork, ILogger<CreatePurchaseOrderCommandHandler> logger)
    { _projectRepository = projectRepository; _purchaseOrderRepository = purchaseOrderRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<PurchaseOrderDto> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var entity = new PurchaseOrder
        {
            ProjectId = request.ProjectId,
            OrderReference = request.OrderReference,
            SupplierName = request.SupplierName,
            SupplierContact = request.SupplierContact,
            Description = request.Description,
            Status = PurchaseOrderStatus.Draft,
            TotalValue = request.TotalValue,
            Currency = request.Currency ?? "GBP",
            OrderDate = DateTime.UtcNow,
            ExpectedDeliveryDate = request.ExpectedDeliveryDate,
            Notes = request.Notes
        };
        await _purchaseOrderRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("PurchaseOrder {PurchaseOrderId} '{OrderReference}' created for project {ProjectId}", entity.Id, entity.OrderReference, entity.ProjectId);
        return new PurchaseOrderDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            OrderReference = entity.OrderReference,
            SupplierName = entity.SupplierName,
            SupplierContact = entity.SupplierContact,
            Description = entity.Description,
            Status = entity.Status,
            TotalValue = entity.TotalValue,
            Currency = entity.Currency,
            OrderDate = entity.OrderDate,
            ExpectedDeliveryDate = entity.ExpectedDeliveryDate,
            ActualDeliveryDate = entity.ActualDeliveryDate,
            ApprovedBy = entity.ApprovedBy,
            Notes = entity.Notes,
            DeliveryCount = 0,
            CreatedAt = entity.CreatedAt
        };
    }
}
