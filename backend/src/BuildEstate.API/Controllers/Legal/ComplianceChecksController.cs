using BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.ChangeComplianceStatus;
using BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.CreateComplianceCheck;
using BuildEstate.Application.Features.Legal.ComplianceChecks.DTOs;
using BuildEstate.Application.Features.Legal.ComplianceChecks.Queries.GetComplianceChecksByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Legal;

/// <summary>
/// API controller for compliance checks (sub-resource of opportunities).
/// </summary>
[ApiController]
[Route("api/v1/opportunities/{opportunityId:guid}/compliance-checks")]
[Authorize]
[Produces("application/json")]
public class ComplianceChecksController : ControllerBase
{
    private readonly IMediator _mediator;

    public ComplianceChecksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager")]
    [ProducesResponseType(typeof(ApiResponse<List<ComplianceCheckDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(Guid opportunityId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetComplianceChecksByOpportunityQuery(opportunityId), cancellationToken);
        return Ok(ApiResponse<List<ComplianceCheckDto>>.Ok(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<ComplianceCheckDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        Guid opportunityId,
        [FromBody] CreateComplianceCheckCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { OpportunityId = opportunityId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ComplianceCheckDto>.Ok(result));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeStatus(
        Guid opportunityId, Guid id,
        [FromBody] ChangeComplianceStatusCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithIds = command with { Id = id, OpportunityId = opportunityId };
        await _mediator.Send(commandWithIds, cancellationToken);
        return NoContent();
    }
}
