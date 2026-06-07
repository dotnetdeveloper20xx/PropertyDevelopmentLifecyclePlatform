using BuildEstate.Application.Features.Sales.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Sales.Commands.CreateSalesLead;
public record CreateSalesLeadCommand : IRequest<SalesLeadDto>
{
    public Guid? ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Source { get; init; }
    public string? InterestDetails { get; init; }
    public decimal? Budget { get; init; }
    public string? Notes { get; init; }
}
