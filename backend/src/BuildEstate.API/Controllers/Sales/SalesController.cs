using BuildEstate.API.Authorization;
using BuildEstate.Application.Features.Sales.Commands.CreateSalesLead;
using BuildEstate.Application.Features.Sales.Commands.UpdateSalesLead;
using BuildEstate.Application.Features.Sales.DTOs;
using BuildEstate.Application.Features.Sales.Queries.GetSalesLeads;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Sales;

[ApiController]
[Route("api/v1/sales-leads")]
[Authorize]
[Produces("application/json")]
public class SalesController : ControllerBase
{
    private readonly IMediator _mediator;
    public SalesController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,SalesManager")]
    [HasPermission("Sales.View")]
    [ProducesResponseType(typeof(ApiResponse<List<SalesLeadDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetSalesLeadsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,SalesManager")]
    [HasPermission("Sales.Create")]
    [ProducesResponseType(typeof(ApiResponse<SalesLeadDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateSalesLeadCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<SalesLeadDto>.Ok(result, "Sales lead created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,SalesManager")]
    [HasPermission("Sales.Edit")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSalesLeadCommand command, CancellationToken ct)
    {
        if (id != command.Id) return BadRequest(new { success = false, errors = new[] { "Route ID does not match body ID." } });
        await _mediator.Send(command, ct);
        return NoContent();
    }
}
