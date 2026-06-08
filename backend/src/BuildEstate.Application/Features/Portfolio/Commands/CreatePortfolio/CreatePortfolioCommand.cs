using BuildEstate.Application.Features.Portfolio.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Portfolio.Commands.CreatePortfolio;

public record CreatePortfolioCommand : IRequest<PortfolioDto>
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Region { get; init; }
    public int TargetUnits { get; init; }
    public decimal TargetInvestment { get; init; }
    public decimal TargetProfit { get; init; }
    public RiskLevel RiskLevel { get; init; }
    public string? Notes { get; init; }
}
