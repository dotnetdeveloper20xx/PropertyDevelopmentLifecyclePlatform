using BuildEstate.Application.Features.LandAcquisition.Documents.Commands.CreateDocument;
using BuildEstate.Application.Features.LandAcquisition.Documents.Commands.DeleteDocument;
using BuildEstate.Application.Features.LandAcquisition.Documents.DTOs;
using BuildEstate.Application.Features.LandAcquisition.Documents.Queries.GetDocumentsByOpportunity;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.LandAcquisition;

/// <summary>
/// API controller for documents attached to land opportunities.
/// </summary>
[ApiController]
[Route("api/v1/opportunities/{opportunityId:guid}/documents")]
[Authorize]
[Produces("application/json")]
public class DocumentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DocumentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,LegalOfficer,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<DocumentListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(Guid opportunityId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDocumentsByOpportunityQuery(opportunityId), cancellationToken);
        return Ok(ApiResponse<List<DocumentListItemDto>>.Ok(result));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager,LegalOfficer")]
    [ProducesResponseType(typeof(ApiResponse<DocumentListItemDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(
        Guid opportunityId,
        [FromBody] CreateDocumentCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithId = command with { OpportunityId = opportunityId };
        var result = await _mediator.Send(commandWithId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<DocumentListItemDto>.Ok(result));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,AcquisitionManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid opportunityId, Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteDocumentCommand(id, opportunityId), cancellationToken);
        return NoContent();
    }
}
