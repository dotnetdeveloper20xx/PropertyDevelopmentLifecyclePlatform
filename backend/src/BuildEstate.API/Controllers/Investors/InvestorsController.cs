using BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
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
    [ProducesResponseType(typeof(ApiResponse<List<InvestorDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetInvestorsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<InvestorDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateInvestorCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<InvestorDto>.Ok(result, "Investor created successfully."));
    }
}
