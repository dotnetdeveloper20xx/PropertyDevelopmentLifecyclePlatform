using BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.ChangeOpportunityStatus;
using BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.CreateOpportunity;
using BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.DeleteOpportunity;
using BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.UpdateOpportunity;
using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunities;
using BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityById;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for land acquisition opportunities.
/// Thin controller — all business logic lives in CQRS handlers.
/// </summary>
[ApiController]
[Route("api/v1/opportunities")]
[Authorize]
[Produces("application/json")]
public class OpportunitiesController : ControllerBase
{
    private readonly IMediator _mediator;

    public OpportunitiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get a paginated list of opportunities with optional filtering and sorting.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<OpportunityListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] string sortDir = "desc",
        [FromQuery] string? search = null,
        [FromQuery] OpportunityStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetOpportunitiesQuery
        {
            Page = page,
            PageSize = pageSize,
            SortBy = sortBy,
            SortDir = sortDir,
            Search = search,
            Status = status
        };

        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get a single opportunity by ID with full detail.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,FinanceDirector,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<OpportunityDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetOpportunityByIdQuery(id), cancellationToken);
        return Ok(ApiResponse<OpportunityDetailDto>.Ok(result));
    }

    /// <summary>
    /// Create a new land opportunity.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(typeof(ApiResponse<CreateOpportunityDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateOpportunityCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            ApiResponse<CreateOpportunityDto>.Ok(result, "Opportunity created successfully."));
    }

    /// <summary>
    /// Update an existing opportunity.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateOpportunityCommand command,
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
    /// Soft-delete an opportunity. SuperAdmin only.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteOpportunityCommand(id), cancellationToken);
        return NoContent();
    }

    /// <summary>
    /// Transition an opportunity to a new status. Enforces state machine rules.
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeStatus(
        Guid id,
        [FromBody] ChangeStatusRequest request,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new ChangeOpportunityStatusCommand(id, request.NewStatus),
            cancellationToken);
        return NoContent();
    }
}

/// <summary>
/// Request body for status change endpoint.
/// </summary>
public record ChangeStatusRequest(OpportunityStatus NewStatus);
