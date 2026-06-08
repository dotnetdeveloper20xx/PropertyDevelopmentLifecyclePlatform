using BuildEstate.API.Authorization;
using BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
using BuildEstate.Application.Features.Investors.Commands.UpdateInvestor;
using BuildEstate.Application.Features.Investors.DTOs;
using BuildEstate.Application.Features.Investors.Queries.GetInvestors;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Investors;

[ApiController]
[Route("api/v1/investors")]
[Authorize]
[Produces("application/json")]
public class InvestorsController : ControllerBase
{
    private readonly IMediator _mediator;
    public InvestorsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    [HasPermission("Investors.View")]
    [ProducesResponseType(typeof(ApiResponse<List<InvestorDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetInvestorsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    [HasPermission("Investors.Create")]
    [ProducesResponseType(typeof(ApiResponse<InvestorDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateInvestorCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<InvestorDto>.Ok(result, "Investor created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    [HasPermission("Investors.Edit")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvestorCommand command, CancellationToken ct)
    {
        if (id != command.Id) return BadRequest(new { success = false, errors = new[] { "Route ID does not match body ID." } });
        await _mediator.Send(command, ct);
        return NoContent();
    }
}
