using BuildEstate.API.Authorization;
using BuildEstate.Application.Features.Reports.Commands.CreateReport;
using BuildEstate.Application.Features.Reports.DTOs;
using BuildEstate.Application.Features.Reports.Queries.GetReports;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Reports;

[ApiController]
[Route("api/v1/reports")]
[Authorize]
[Produces("application/json")]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,FinanceDirector,ProjectManager")]
    [HasPermission("Reports.View")]
    [ProducesResponseType(typeof(ApiResponse<List<SavedReportDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetReportsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,FinanceDirector,ProjectManager")]
    [HasPermission("Reports.Create")]
    [ProducesResponseType(typeof(ApiResponse<SavedReportDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateReportCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<SavedReportDto>.Ok(result, "Report created successfully."));
    }
}
