using BuildEstate.Application.Features.LandAcquisition.LandOwners.Commands.CreateLandOwner;
using BuildEstate.Application.Features.LandAcquisition.LandOwners.DTOs;
using BuildEstate.Application.Features.LandAcquisition.LandOwners.Queries.GetLandOwners;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for land owners (contacts/sellers).
/// </summary>
[ApiController]
[Route("api/v1/land-owners")]
[Authorize]
[Produces("application/json")]
public class LandOwnersController : ControllerBase
{
    private readonly IMediator _mediator;

    public LandOwnersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<List<LandOwnerDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetLandOwnersQuery(), cancellationToken);
        return Ok(ApiResponse<List<LandOwnerDto>>.Ok(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(typeof(ApiResponse<LandOwnerDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateLandOwnerCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<LandOwnerDto>.Ok(result));
    }
}
