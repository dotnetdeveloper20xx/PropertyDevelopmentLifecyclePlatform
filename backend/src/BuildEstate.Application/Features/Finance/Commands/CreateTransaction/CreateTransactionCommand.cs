using BuildEstate.Application.Features.Finance.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Finance.Commands.CreateTransaction;
public record CreateTransactionCommand : IRequest<FinancialTransactionDto>
{
    public Guid ProjectId { get; init; }
    public TransactionType Type { get; init; }
    public string Description { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string? Category { get; init; }
    public string? Reference { get; init; }
    public string? Notes { get; init; }
}
