using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Finance.DTOs;
public record FinancialTransactionDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public TransactionType Type { get; init; }
    public string Description { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime TransactionDate { get; init; }
    public string? Category { get; init; }
    public string? Reference { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
