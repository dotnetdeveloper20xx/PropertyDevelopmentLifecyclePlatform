using BuildEstate.Application.Features.Planning.Appeals.Commands.ChangeAppealStatus;
using BuildEstate.Application.Features.Planning.Appeals.Commands.CreatePlanningAppeal;
using BuildEstate.Application.Features.Planning.Appeals.DTOs;
using BuildEstate.Application.Features.Planning.Appeals.Queries.GetAppealsByApplication;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Planning;

/// <summary>
/// API controller for planning appeals (sub-resource of planning applications).
/// </summary>
[ApiController]
[Route("api/v1/planning-applications/{applicationId:guid}/appeals")]
[Authorize]
[Produces("application/json")]
public class PlanningAppealsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlanningAppealsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all appeals for a planning application.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,PlanningManager,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<List<PlanningAppealDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(Guid applicationId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAppealsByApplicationQuery(applicationId), cancellationToken);
        return Ok(ApiResponse<List<PlanningAppealDto>>.Ok(result));
    }

    /// <summary>
    /// Create a new appeal for a refused planning application.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(typeof(ApiResponse<PlanningAppealDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create(
        Guid applicationId,
        [FromBody] CreatePlanningAppealCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { PlanningApplicationId = applicationId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<PlanningAppealDto>.Ok(result));
    }

    /// <summary>
    /// Change the status of an appeal.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeStatus(
        Guid applicationId,
        Guid id,
        [FromBody] AppealStatusRequest request,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new ChangeAppealStatusCommand(id, applicationId, request.NewStatus),
            cancellationToken);
        return NoContent();
    }
}

public record AppealStatusRequest(AppealStatus NewStatus);
