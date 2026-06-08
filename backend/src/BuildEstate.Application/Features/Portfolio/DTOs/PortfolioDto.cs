using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Portfolio.DTOs;

public record PortfolioDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Region { get; init; }
    public int TargetUnits { get; init; }
    public decimal TargetInvestment { get; init; }
    public decimal TargetProfit { get; init; }
    public RiskLevel RiskLevel { get; init; }
    public PortfolioStatus Status { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
