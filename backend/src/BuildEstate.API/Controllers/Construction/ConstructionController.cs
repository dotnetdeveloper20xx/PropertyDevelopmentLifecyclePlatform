using BuildEstate.Application.Features.Construction.Commands.CreateConstructionStage;
using BuildEstate.Application.Features.Construction.Commands.CreateInspection;
using BuildEstate.Application.Features.Construction.Commands.CreateSnag;
using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Application.Features.Construction.Queries.GetInspectionsByStage;
using BuildEstate.Application.Features.Construction.Queries.GetSnagsByStage;
using BuildEstate.Application.Features.Construction.Queries.GetStagesByProject;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Construction;

[ApiController]
[Authorize]
[Produces("application/json")]
public class ConstructionController : ControllerBase
{
    private readonly IMediator _mediator;
    public ConstructionController(IMediator mediator) { _mediator = mediator; }

    // Construction Stages
    [HttpGet("api/v1/projects/{projectId:guid}/construction-stages")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<ConstructionStageDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStages(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<ConstructionStageDto>>.Ok(await _mediator.Send(new GetStagesByProjectQuery(projectId), ct)));
    }

    [HttpPost("api/v1/projects/{projectId:guid}/construction-stages")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<ConstructionStageDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateStage(Guid projectId, [FromBody] CreateConstructionStageCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ConstructionStageDto>.Ok(result, "Construction stage created successfully."));
    }

    // Inspections
    [HttpGet("api/v1/construction-stages/{stageId:guid}/inspections")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<InspectionDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInspections(Guid stageId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<InspectionDto>>.Ok(await _mediator.Send(new GetInspectionsByStageQuery(stageId), ct)));
    }

    [HttpPost("api/v1/construction-stages/{stageId:guid}/inspections")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<InspectionDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateInspection(Guid stageId, [FromBody] CreateInspectionCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ConstructionStageId = stageId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<InspectionDto>.Ok(result, "Inspection created successfully."));
    }

    // Snags
    [HttpGet("api/v1/construction-stages/{stageId:guid}/snags")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<SnagDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSnags(Guid stageId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<SnagDto>>.Ok(await _mediator.Send(new GetSnagsByStageQuery(stageId), ct)));
    }

    [HttpPost("api/v1/construction-stages/{stageId:guid}/snags")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<SnagDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateSnag(Guid stageId, [FromBody] CreateSnagCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ConstructionStageId = stageId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<SnagDto>.Ok(result, "Snag created successfully."));
    }
}
