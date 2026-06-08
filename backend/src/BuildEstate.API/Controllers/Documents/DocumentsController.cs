using BuildEstate.Application.Features.Documents.Commands.CreateDocument;
using BuildEstate.Application.Features.Documents.DTOs;
using BuildEstate.Application.Features.Documents.Queries.GetDocuments;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Documents;

[ApiController]
[Route("api/v1/documents")]
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
    [Authorize(Roles = "SuperAdmin,ProjectManager,LegalOfficer,Admin")]
    [ProducesResponseType(typeof(ApiResponse<List<KnowledgeDocumentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetDocumentsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,ProjectManager,LegalOfficer,Admin")]
    [ProducesResponseType(typeof(ApiResponse<KnowledgeDocumentDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateDocumentCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<KnowledgeDocumentDto>.Ok(result, "Document created successfully."));
    }
}
