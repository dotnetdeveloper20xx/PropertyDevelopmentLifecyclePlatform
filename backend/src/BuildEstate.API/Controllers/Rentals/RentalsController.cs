using BuildEstate.Application.Features.Rentals.Commands.CreateTenancy;
using BuildEstate.Application.Features.Rentals.DTOs;
using BuildEstate.Application.Features.Rentals.Queries.GetTenancies;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Rentals;

[ApiController]
[Route("api/v1/tenancies")]
[Authorize]
[Produces("application/json")]
public class RentalsController : ControllerBase
{
    private readonly IMediator _mediator;
    public RentalsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,PropertyManager")]
    [ProducesResponseType(typeof(ApiResponse<List<TenancyDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetTenanciesQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PropertyManager")]
    [ProducesResponseType(typeof(ApiResponse<TenancyDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateTenancyCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<TenancyDto>.Ok(result, "Tenancy created successfully."));
    }
}
