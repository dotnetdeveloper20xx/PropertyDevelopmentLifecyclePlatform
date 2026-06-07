using BuildEstate.Application.Features.Rentals.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Rentals.Commands.CreateTenancy;
public record CreateTenancyCommand : IRequest<TenancyDto>
{
    public Guid PropertyUnitId { get; init; }
    public string TenantName { get; init; } = string.Empty;
    public string? TenantEmail { get; init; }
    public string? TenantPhone { get; init; }
    public decimal MonthlyRent { get; init; }
    public DateTime LeaseStartDate { get; init; }
    public DateTime LeaseEndDate { get; init; }
    public string? Notes { get; init; }
}
