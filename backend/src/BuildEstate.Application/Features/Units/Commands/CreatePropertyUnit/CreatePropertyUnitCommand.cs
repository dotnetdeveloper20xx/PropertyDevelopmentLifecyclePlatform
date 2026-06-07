using BuildEstate.Application.Features.Units.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Units.Commands.CreatePropertyUnit;
public record CreatePropertyUnitCommand : IRequest<PropertyUnitDto>
{
    public Guid ProjectId { get; init; }
    public string UnitReference { get; init; } = string.Empty;
    public string? UnitType { get; init; }
    public int? Bedrooms { get; init; }
    public decimal? FloorArea { get; init; }
    public decimal? Price { get; init; }
    public string? Floor { get; init; }
    public string? Notes { get; init; }
}
