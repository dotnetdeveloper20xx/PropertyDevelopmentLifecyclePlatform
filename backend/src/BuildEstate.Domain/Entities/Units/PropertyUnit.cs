using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Units;

public class PropertyUnit : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string UnitReference { get; set; } = string.Empty;
    public string? UnitType { get; set; }
    public int? Bedrooms { get; set; }
    public decimal? FloorArea { get; set; }
    public decimal? Price { get; set; }
    public UnitStatus Status { get; set; } = UnitStatus.NotReleased;
    public string? Floor { get; set; }
    public string? Notes { get; set; }

    public Project Project { get; set; } = null!;
}
