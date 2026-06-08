using BuildEstate.Application.Features.Contractors.Commands.CreateContractor;
using BuildEstate.Application.Features.Contractors.Commands.UpdateContractor;
using BuildEstate.Application.Features.Contractors.DTOs;
using BuildEstate.Application.Features.Contractors.Queries.GetContractors;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Contractors;

[ApiController]
[Route("api/v1/contractors")]
[Authorize]
[Produces("application/json")]
public class ContractorsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ContractorsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<ContractorDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetContractorsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<ContractorDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateContractorCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ContractorDto>.Ok(result, "Contractor created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateContractorCommand command, CancellationToken ct)
    {
        if (id != command.Id) return BadRequest(new { success = false, errors = new[] { "Route ID does not match body ID." } });
        await _mediator.Send(command, ct);
        return NoContent();
    }
}
