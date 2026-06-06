using BuildEstate.Application.Features.LandAcquisition.Offers.Commands.CreateOffer;
using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using BuildEstate.Application.Features.LandAcquisition.Offers.Queries.GetOffersByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for offers (sub-resource of opportunities).
/// </summary>
[ApiController]
[Route("api/v1/opportunities/{opportunityId:guid}/offers")]
[Authorize]
[Produces("application/json")]
public class OffersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OffersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all offers for an opportunity.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<OfferListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(Guid opportunityId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetOffersByOpportunityQuery(opportunityId), cancellationToken);
        return Ok(ApiResponse<List<OfferListItemDto>>.Ok(result));
    }

    /// <summary>
    /// Create a new offer on an opportunity.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(typeof(ApiResponse<OfferListItemDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create(
        Guid opportunityId,
        [FromBody] CreateOfferCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { OpportunityId = opportunityId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<OfferListItemDto>.Ok(result));
    }
}
