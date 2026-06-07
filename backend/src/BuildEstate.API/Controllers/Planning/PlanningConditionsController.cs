using BuildEstate.Application.Features.Planning.Conditions.Commands.CreatePlanningCondition;
using BuildEstate.Application.Features.Planning.Conditions.Commands.DischargeCondition;
using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using BuildEstate.Application.Features.Planning.Conditions.Queries.GetConditionsByApplication;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Planning;

/// <summary>
/// API controller for planning conditions (sub-resource of planning applications).
/// </summary>
[ApiController]
[Route("api/v1/planning-applications/{applicationId:guid}/conditions")]
[Authorize]
[Produces("application/json")]
public class PlanningConditionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlanningConditionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all conditions for a planning application.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,PlanningManager,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<List<PlanningConditionDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(Guid applicationId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetConditionsByApplicationQuery(applicationId), cancellationToken);
        return Ok(ApiResponse<List<PlanningConditionDto>>.Ok(result));
    }

    /// <summary>
    /// Create a new condition for a planning application.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(typeof(ApiResponse<PlanningConditionDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create(
        Guid applicationId,
        [FromBody] CreatePlanningConditionCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { PlanningApplicationId = applicationId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<PlanningConditionDto>.Ok(result));
    }

    /// <summary>
    /// Discharge (or partially discharge) a planning condition.
    /// </summary>
    [HttpPatch("{id:guid}/discharge")]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(typeof(ApiResponse<PlanningConditionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Discharge(
        Guid applicationId,
        Guid id,
        [FromBody] DischargeConditionCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithIds = command with { Id = id, PlanningApplicationId = applicationId };
        var result = await _mediator.Send(commandWithIds, cancellationToken);
        return Ok(ApiResponse<PlanningConditionDto>.Ok(result));
    }
}
