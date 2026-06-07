using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Rentals.DTOs;
public record TenancyDto
{
    public Guid Id { get; init; }
    public Guid PropertyUnitId { get; init; }
    public string TenantName { get; init; } = string.Empty;
    public string? TenantEmail { get; init; }
    public string? TenantPhone { get; init; }
    public decimal MonthlyRent { get; init; }
    public DateTime LeaseStartDate { get; init; }
    public DateTime LeaseEndDate { get; init; }
    public TenancyStatus Status { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
