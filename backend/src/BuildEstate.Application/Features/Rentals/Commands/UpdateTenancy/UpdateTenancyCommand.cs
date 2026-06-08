using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Rentals.Commands.UpdateTenancy;

/// <summary>
/// Command to update an existing tenancy.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public record UpdateTenancyCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string TenantName { get; init; } = string.Empty;
    public string? TenantEmail { get; init; }
    public string? TenantPhone { get; init; }
    public decimal MonthlyRent { get; init; }
    public DateTime LeaseStartDate { get; init; }
    public DateTime LeaseEndDate { get; init; }
    public TenancyStatus Status { get; init; }
    public string? Notes { get; init; }
}
