using BuildEstate.API.Authorization;
using BuildEstate.Application.Features.Defects.Commands.CreateDefect;
using BuildEstate.Application.Features.Defects.DTOs;
using BuildEstate.Application.Features.Defects.Queries.GetDefects;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Defects;

[ApiController]
[Route("api/v1/defects")]
[Authorize]
[Produces("application/json")]
public class DefectsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DefectsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager,PropertyManager")]
    [HasPermission("Defects.View")]
    [ProducesResponseType(typeof(ApiResponse<List<DefectDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetDefectsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager,PropertyManager")]
    [HasPermission("Defects.Create")]
    [ProducesResponseType(typeof(ApiResponse<DefectDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateDefectCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id },
            ApiResponse<DefectDto>.Ok(result, "Defect reported successfully."));
    }
}
