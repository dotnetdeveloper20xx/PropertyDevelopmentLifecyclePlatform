using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Finance.DTOs;
public record BudgetLineDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string Category { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal PlannedAmount { get; init; }
    public decimal ActualAmount { get; init; }
    public BudgetLineStatus Status { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
