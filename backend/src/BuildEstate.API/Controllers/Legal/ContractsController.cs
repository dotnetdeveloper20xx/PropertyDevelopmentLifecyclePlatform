using BuildEstate.Application.Features.Legal.Contracts.Commands.ChangeContractStatus;
using BuildEstate.Application.Features.Legal.Contracts.Commands.CreateContract;
using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using BuildEstate.Application.Features.Legal.Contracts.Queries.GetContractById;
using BuildEstate.Application.Features.Legal.Contracts.Queries.GetContracts;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Legal;

/// <summary>
/// API controller for legal contracts.
/// </summary>
[ApiController]
[Route("api/v1/contracts")]
[Authorize]
[Produces("application/json")]
public class ContractsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ContractsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<ContractListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] GetContractsQuery query, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer,AcquisitionManager,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<ContractDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetContractByIdQuery(id), cancellationToken);
        return Ok(ApiResponse<ContractDetailDto>.Ok(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<CreateContractDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateContractCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(
            nameof(GetById), new { id = result.Id },
            ApiResponse<CreateContractDto>.Ok(result, "Contract created successfully."));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,LegalOfficer")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeStatus(
        Guid id, [FromBody] ContractStatusRequest request, CancellationToken cancellationToken)
    {
        await _mediator.Send(new ChangeContractStatusCommand(id, request.NewStatus), cancellationToken);
        return NoContent();
    }
}

public record ContractStatusRequest(ContractStatus NewStatus);
