using BuildEstate.Application.Features.Feasibility.Commands.CreateFeasibility;
using BuildEstate.Application.Features.Feasibility.DTOs;
using BuildEstate.Application.Features.Feasibility.Queries.GetFeasibilityByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Feasibility;

[ApiController]
[Authorize]
[Produces("application/json")]
public class FeasibilityController : ControllerBase
{
    private readonly IMediator _mediator;

    public FeasibilityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("api/v1/opportunities/{opportunityId:guid}/feasibility")]
    [Authorize(Roles = "SuperAdmin,ValuationAnalyst,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<FeasibilityAssessmentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByOpportunity(Guid opportunityId, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetFeasibilityByOpportunityQuery(opportunityId), ct);
        return Ok(ApiResponse<List<FeasibilityAssessmentDto>>.Ok(result));
    }

    [HttpPost("api/v1/opportunities/{opportunityId:guid}/feasibility")]
    [Authorize(Roles = "SuperAdmin,ValuationAnalyst,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<FeasibilityAssessmentDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(Guid opportunityId, [FromBody] CreateFeasibilityCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { OpportunityId = opportunityId }, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<FeasibilityAssessmentDto>.Ok(result, "Feasibility assessment created successfully."));
    }
}
