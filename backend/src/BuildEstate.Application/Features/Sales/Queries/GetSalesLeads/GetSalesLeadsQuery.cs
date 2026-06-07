using BuildEstate.Application.Features.Sales.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
namespace BuildEstate.Application.Features.Sales.Queries.GetSalesLeads;
public record GetSalesLeadsQuery : IRequest<ApiResponse<List<SalesLeadDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
    public LeadStatus? Status { get; init; }
}
