using BuildEstate.Application.Features.Procurement.DTOs;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Procurement.Commands.CreateDelivery;
public class CreateDeliveryCommandHandler : IRequestHandler<CreateDeliveryCommand, DeliveryDto>
{
    private readonly IRepository<PurchaseOrder> _purchaseOrderRepository;
    private readonly IRepository<Delivery> _deliveryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateDeliveryCommandHandler> _logger;
    public CreateDeliveryCommandHandler(IRepository<PurchaseOrder> purchaseOrderRepository, IRepository<Delivery> deliveryRepository, IUnitOfWork unitOfWork, ILogger<CreateDeliveryCommandHandler> logger)
    { _purchaseOrderRepository = purchaseOrderRepository; _deliveryRepository = deliveryRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<DeliveryDto> Handle(CreateDeliveryCommand request, CancellationToken cancellationToken)
    {
        var orderExists = await _purchaseOrderRepository.ExistsAsync(x => x.Id == request.PurchaseOrderId, cancellationToken);
        if (!orderExists) throw new NotFoundException(nameof(PurchaseOrder), request.PurchaseOrderId);
        var entity = new Delivery
        {
            PurchaseOrderId = request.PurchaseOrderId,
            DeliveryReference = request.DeliveryReference,
            Status = DeliveryStatus.Pending,
            DeliveryDate = request.DeliveryDate,
            ReceivedBy = request.ReceivedBy,
            Items = request.Items,
            Notes = request.Notes
        };
        await _deliveryRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Delivery {DeliveryId} created for PurchaseOrder {PurchaseOrderId}", entity.Id, entity.PurchaseOrderId);
        return new DeliveryDto
        {
            Id = entity.Id,
            PurchaseOrderId = entity.PurchaseOrderId,
            DeliveryReference = entity.DeliveryReference,
            Status = entity.Status,
            DeliveryDate = entity.DeliveryDate,
            ReceivedBy = entity.ReceivedBy,
            Items = entity.Items,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
