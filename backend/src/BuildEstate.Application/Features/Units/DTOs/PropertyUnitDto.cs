using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Units.DTOs;
public record PropertyUnitDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string UnitReference { get; init; } = string.Empty;
    public string? UnitType { get; init; }
    public int? Bedrooms { get; init; }
    public decimal? FloorArea { get; init; }
    public decimal? Price { get; init; }
    public UnitStatus Status { get; init; }
    public string? Floor { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
