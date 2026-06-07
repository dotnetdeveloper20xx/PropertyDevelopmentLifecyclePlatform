using BuildEstate.Application.Features.LandAcquisition.Activity.DTOs;
using BuildEstate.Application.Features.LandAcquisition.Activity.Queries.GetActivityByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for activity/audit trail per opportunity.
/// </summary>
[ApiController]
[Route("api/v1/opportunities/{opportunityId:guid}/activity")]
[Authorize]
[Produces("application/json")]
public class ActivityController : ControllerBase
{
    private readonly IMediator _mediator;

    public ActivityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get the activity/audit trail for an opportunity and all its sub-entities.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,FinanceDirector,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<List<ActivityItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActivity(Guid opportunityId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetActivityByOpportunityQuery(opportunityId), cancellationToken);
        return Ok(ApiResponse<List<ActivityItemDto>>.Ok(result));
    }
}
