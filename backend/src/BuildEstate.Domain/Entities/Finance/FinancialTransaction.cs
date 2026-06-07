using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Finance;

public class FinancialTransaction : BaseEntity
{
    public Guid ProjectId { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "GBP";
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    public string? Category { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }

    public Project Project { get; set; } = null!;
}
