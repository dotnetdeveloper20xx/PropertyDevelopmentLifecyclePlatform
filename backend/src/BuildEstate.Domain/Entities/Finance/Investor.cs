using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Finance;

public class Investor : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public InvestorType Type { get; set; }
    public string? ContactName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public decimal? TotalCommitted { get; set; }
    public decimal? TotalDeployed { get; set; }
    public string? Notes { get; set; }
}
