using BuildEstate.Application.Features.Finance.Commands.CreateBudgetLine;
using BuildEstate.Application.Features.Finance.Commands.CreateTransaction;
using BuildEstate.Application.Features.Finance.DTOs;
using BuildEstate.Application.Features.Finance.Queries.GetBudgetLinesByProject;
using BuildEstate.Application.Features.Finance.Queries.GetTransactionsByProject;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Finance;

[ApiController]
[Authorize]
[Produces("application/json")]
public class FinanceController : ControllerBase
{
    private readonly IMediator _mediator;
    public FinanceController(IMediator mediator) { _mediator = mediator; }

    // Budget Lines
    [HttpGet("api/v1/projects/{projectId:guid}/budget-lines")]
    [Authorize(Roles = "SuperAdmin,FinanceDirector,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<List<BudgetLineDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBudgetLines(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<BudgetLineDto>>.Ok(await _mediator.Send(new GetBudgetLinesByProjectQuery(projectId), ct)));
    }

    [HttpPost("api/v1/projects/{projectId:guid}/budget-lines")]
    [Authorize(Roles = "SuperAdmin,FinanceDirector,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<BudgetLineDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateBudgetLine(Guid projectId, [FromBody] CreateBudgetLineCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<BudgetLineDto>.Ok(result, "Budget line created successfully."));
    }

    // Transactions
    [HttpGet("api/v1/projects/{projectId:guid}/transactions")]
    [Authorize(Roles = "SuperAdmin,FinanceDirector,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<List<FinancialTransactionDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTransactions(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<FinancialTransactionDto>>.Ok(await _mediator.Send(new GetTransactionsByProjectQuery(projectId), ct)));
    }

    [HttpPost("api/v1/projects/{projectId:guid}/transactions")]
    [Authorize(Roles = "SuperAdmin,FinanceDirector,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<FinancialTransactionDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateTransaction(Guid projectId, [FromBody] CreateTransactionCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<FinancialTransactionDto>.Ok(result, "Transaction created successfully."));
    }
}
