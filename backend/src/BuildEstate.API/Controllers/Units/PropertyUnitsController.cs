using BuildEstate.Application.Features.Units.Commands.CreatePropertyUnit;
using BuildEstate.Application.Features.Units.DTOs;
using BuildEstate.Application.Features.Units.Queries.GetUnitsByProject;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Units;

[ApiController]
[Authorize]
[Produces("application/json")]
public class PropertyUnitsController : ControllerBase
{
    private readonly IMediator _mediator;
    public PropertyUnitsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet("api/v1/projects/{projectId:guid}/units")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SalesManager")]
    [ProducesResponseType(typeof(ApiResponse<List<PropertyUnitDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUnits(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<PropertyUnitDto>>.Ok(await _mediator.Send(new GetUnitsByProjectQuery(projectId), ct)));
    }

    [HttpPost("api/v1/projects/{projectId:guid}/units")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SalesManager")]
    [ProducesResponseType(typeof(ApiResponse<PropertyUnitDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateUnit(Guid projectId, [FromBody] CreatePropertyUnitCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<PropertyUnitDto>.Ok(result, "Property unit created successfully."));
    }
}
