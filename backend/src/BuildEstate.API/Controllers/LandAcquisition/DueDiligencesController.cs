using BuildEstate.API.Authorization;
using BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.CreateDueDiligence;
using BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.UpdateDueDiligence;
using BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;
using BuildEstate.Application.Features.LandAcquisition.DueDiligences.Queries.GetDueDiligencesByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for due diligence checks (sub-resource of opportunities).
/// </summary>
[ApiController]
[Route("api/v1/opportunities/{opportunityId:guid}/due-diligences")]
[Authorize]
[Produces("application/json")]
public class DueDiligencesController : ControllerBase
{
    private readonly IMediator _mediator;

    public DueDiligencesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all due diligence checks for an opportunity.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,LegalOfficer")]
    [HasPermission("DueDiligence.View")]
    [ProducesResponseType(typeof(ApiResponse<List<DueDiligenceListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(Guid opportunityId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetDueDiligencesByOpportunityQuery(opportunityId), cancellationToken);
        return Ok(ApiResponse<List<DueDiligenceListItemDto>>.Ok(result));
    }

    /// <summary>
    /// Create a new due diligence check for an opportunity.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [HasPermission("DueDiligence.Create")]
    [ProducesResponseType(typeof(ApiResponse<DueDiligenceListItemDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create(
        Guid opportunityId,
        [FromBody] CreateDueDiligenceCommand command,
        CancellationToken cancellationToken)
    {
        // Ensure route and body match
        var commandWithId = command with { OpportunityId = opportunityId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<DueDiligenceListItemDto>.Ok(result));
    }

    /// <summary>
    /// Update an existing due diligence check.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [HasPermission("DueDiligence.Edit")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid opportunityId,
        Guid id,
        [FromBody] UpdateDueDiligenceCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithIds = command with { Id = id, OpportunityId = opportunityId };
        await _mediator.Send(commandWithIds, cancellationToken);
        return NoContent();
    }
}
