using BuildEstate.Application.Features.Legal.Tasks.Commands.ChangeLegalTaskStatus;
using BuildEstate.Application.Features.Legal.Tasks.Commands.CreateLegalTask;
using BuildEstate.Application.Features.Legal.Tasks.DTOs;
using BuildEstate.Application.Features.Legal.Tasks.Queries.GetLegalTasks;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Legal;

/// <summary>
/// API controller for legal tasks.
/// </summary>
[ApiController]
[Route("api/v1/legal-tasks")]
[Authorize]
[Produces("application/json")]
public class LegalTasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public LegalTasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager")]
    [ProducesResponseType(typeof(ApiResponse<List<LegalTaskDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetLegalTasksQuery query, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<LegalTaskDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateLegalTaskCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<LegalTaskDto>.Ok(result));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeStatus(
        Guid id, [FromBody] LegalTaskStatusRequest request, CancellationToken cancellationToken)
    {
        await _mediator.Send(new ChangeLegalTaskStatusCommand(id, request.NewStatus), cancellationToken);
        return NoContent();
    }
}

public record LegalTaskStatusRequest(LegalTaskStatus NewStatus);
