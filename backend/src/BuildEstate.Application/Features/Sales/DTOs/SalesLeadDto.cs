using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Sales.DTOs;
public record SalesLeadDto
{
    public Guid Id { get; init; }
    public Guid? ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Source { get; init; }
    public LeadStatus Status { get; init; }
    public string? InterestDetails { get; init; }
    public decimal? Budget { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
