using BuildEstate.Application.Features.LandAcquisition.Acquisitions.Commands.CreateAcquisitionRecord;
using BuildEstate.Application.Features.LandAcquisition.Acquisitions.DTOs;
using BuildEstate.Application.Features.LandAcquisition.Acquisitions.Queries.GetAcquisitionByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for acquisition/completion records (steps 4-7 of the lifecycle).
/// </summary>
[ApiController]
[Route("api/v1/opportunities/{opportunityId:guid}/acquisition")]
[Authorize]
[Produces("application/json")]
public class AcquisitionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AcquisitionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get the acquisition record for an opportunity (if it exists).
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,FinanceDirector,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<AcquisitionRecordDto?>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(Guid opportunityId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAcquisitionByOpportunityQuery(opportunityId), cancellationToken);
        return Ok(ApiResponse<AcquisitionRecordDto?>.Ok(result));
    }

    /// <summary>
    /// Create an acquisition record (marks opportunity as Acquired).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(typeof(ApiResponse<AcquisitionRecordDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        Guid opportunityId,
        [FromBody] CreateAcquisitionRecordCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { OpportunityId = opportunityId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<AcquisitionRecordDto>.Ok(result));
    }
}
