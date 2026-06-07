using BuildEstate.Application.Features.Procurement.Commands.CreateDelivery;
using BuildEstate.Application.Features.Procurement.Commands.CreatePurchaseOrder;
using BuildEstate.Application.Features.Procurement.DTOs;
using BuildEstate.Application.Features.Procurement.Queries.GetDeliveriesByOrder;
using BuildEstate.Application.Features.Procurement.Queries.GetPurchaseOrdersByProject;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Procurement;

[ApiController]
[Authorize]
[Produces("application/json")]
public class ProcurementController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProcurementController(IMediator mediator) { _mediator = mediator; }

    // Purchase Orders
    [HttpGet("api/v1/projects/{projectId:guid}/purchase-orders")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<PurchaseOrderDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPurchaseOrders(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<PurchaseOrderDto>>.Ok(await _mediator.Send(new GetPurchaseOrdersByProjectQuery(projectId), ct)));
    }

    [HttpPost("api/v1/projects/{projectId:guid}/purchase-orders")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<PurchaseOrderDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreatePurchaseOrder(Guid projectId, [FromBody] CreatePurchaseOrderCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<PurchaseOrderDto>.Ok(result, "Purchase order created successfully."));
    }

    // Deliveries
    [HttpGet("api/v1/purchase-orders/{orderId:guid}/deliveries")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<DeliveryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDeliveries(Guid orderId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<DeliveryDto>>.Ok(await _mediator.Send(new GetDeliveriesByOrderQuery(orderId), ct)));
    }

    [HttpPost("api/v1/purchase-orders/{orderId:guid}/deliveries")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<DeliveryDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateDelivery(Guid orderId, [FromBody] CreateDeliveryCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { PurchaseOrderId = orderId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<DeliveryDto>.Ok(result, "Delivery created successfully."));
    }
}
