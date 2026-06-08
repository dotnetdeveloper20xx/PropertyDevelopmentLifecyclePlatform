using BuildEstate.Application.Features.Design.Commands.CreateDesignPackage;
using BuildEstate.Application.Features.Design.DTOs;
using BuildEstate.Application.Features.Design.Queries.GetDesignPackagesByProject;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Design;

[ApiController]
[Authorize]
[Produces("application/json")]
public class DesignController : ControllerBase
{
    private readonly IMediator _mediator;

    public DesignController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("api/v1/projects/{projectId:guid}/design-packages")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<List<DesignPackageDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByProject(Guid projectId, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetDesignPackagesByProjectQuery(projectId), ct);
        return Ok(ApiResponse<List<DesignPackageDto>>.Ok(result));
    }

    [HttpPost("api/v1/projects/{projectId:guid}/design-packages")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<DesignPackageDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(Guid projectId, [FromBody] CreateDesignPackageCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<DesignPackageDto>.Ok(result, "Design package created successfully."));
    }
}
