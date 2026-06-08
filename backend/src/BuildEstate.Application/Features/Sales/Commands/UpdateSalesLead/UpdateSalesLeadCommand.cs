using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Sales.Commands.UpdateSalesLead;

/// <summary>
/// Command to update an existing sales lead.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public record UpdateSalesLeadCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Source { get; init; }
    public LeadStatus Status { get; init; }
    public string? InterestDetails { get; init; }
    public decimal? Budget { get; init; }
    public string? Notes { get; init; }
}
