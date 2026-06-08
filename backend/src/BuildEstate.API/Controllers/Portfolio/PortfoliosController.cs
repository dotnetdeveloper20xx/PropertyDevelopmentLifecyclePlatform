using BuildEstate.Application.Features.Portfolio.Commands.CreatePortfolio;
using BuildEstate.Application.Features.Portfolio.DTOs;
using BuildEstate.Application.Features.Portfolio.Queries.GetPortfolios;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Portfolio;

[ApiController]
[Route("api/v1/portfolios")]
[Authorize]
[Produces("application/json")]
public class PortfoliosController : ControllerBase
{
    private readonly IMediator _mediator;

    public PortfoliosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<PortfolioDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetPortfoliosQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<PortfolioDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreatePortfolioCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id },
            ApiResponse<PortfolioDto>.Ok(result, "Portfolio created successfully."));
    }
}
