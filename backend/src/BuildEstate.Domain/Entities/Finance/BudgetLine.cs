using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Finance;

public class BudgetLine : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal PlannedAmount { get; set; }
    public decimal ActualAmount { get; set; }
    public decimal VarianceAmount => ActualAmount - PlannedAmount;
    public BudgetLineStatus Status { get; set; } = BudgetLineStatus.Planned;
    public string? Notes { get; set; }

    public Project Project { get; set; } = null!;
}
