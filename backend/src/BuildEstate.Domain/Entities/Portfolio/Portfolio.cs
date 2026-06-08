using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Portfolio;

public class Portfolio : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Region { get; set; }
    public int TargetUnits { get; set; }
    public decimal TargetInvestment { get; set; }
    public decimal TargetProfit { get; set; }
    public RiskLevel RiskLevel { get; set; } = RiskLevel.Medium;
    public PortfolioStatus Status { get; set; } = PortfolioStatus.Active;
    public string? Notes { get; set; }
}
