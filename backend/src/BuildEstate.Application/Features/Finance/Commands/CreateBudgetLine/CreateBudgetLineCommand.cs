using BuildEstate.Application.Features.Finance.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Finance.Commands.CreateBudgetLine;
public record CreateBudgetLineCommand : IRequest<BudgetLineDto>
{
    public Guid ProjectId { get; init; }
    public string Category { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal PlannedAmount { get; init; }
    public string? Notes { get; init; }
}
