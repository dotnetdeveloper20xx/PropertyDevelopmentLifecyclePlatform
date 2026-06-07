using BuildEstate.Application.Features.Planning.Applications.Commands.ChangePlanningApplicationStatus;
using BuildEstate.Application.Features.Planning.Applications.Commands.CreatePlanningApplication;
using BuildEstate.Application.Features.Planning.Applications.Commands.UpdatePlanningApplication;
using BuildEstate.Application.Features.Planning.Applications.DTOs;
using BuildEstate.Application.Features.Planning.Applications.Queries.GetPlanningApplicationById;
using BuildEstate.Application.Features.Planning.Applications.Queries.GetPlanningApplications;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Planning;

/// <summary>
/// API controller for planning applications.
/// Thin controller — all business logic lives in CQRS handlers.
/// </summary>
[ApiController]
[Route("api/v1/planning-applications")]
[Authorize]
[Produces("application/json")]
public class PlanningApplicationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlanningApplicationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get a paginated list of planning applications with optional filtering and sorting.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,PlanningManager,AcquisitionManager,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<List<PlanningApplicationListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetPlanningApplicationsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get a single planning application by ID with full detail.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,PlanningManager,AcquisitionManager,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<PlanningApplicationDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetPlanningApplicationByIdQuery(id), cancellationToken);
        return Ok(ApiResponse<PlanningApplicationDetailDto>.Ok(result));
    }

    /// <summary>
    /// Create a new planning application.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(typeof(ApiResponse<CreatePlanningApplicationDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreatePlanningApplicationCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            ApiResponse<CreatePlanningApplicationDto>.Ok(result, "Planning application created successfully."));
    }

    /// <summary>
    /// Update an existing planning application.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdatePlanningApplicationCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest(ApiResponse<object>.Fail("Route ID does not match body ID."));
        }

        await _mediator.Send(command, cancellationToken);
        return NoContent();
    }

    /// <summary>
    /// Transition a planning application to a new status. Enforces state machine rules.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,PlanningManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeStatus(
        Guid id,
        [FromBody] ChangeStatusRequest request,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new ChangePlanningApplicationStatusCommand(id, request.NewStatus),
            cancellationToken);
        return NoContent();
    }
}

public record ChangeStatusRequest(PlanningApplicationStatus NewStatus);
