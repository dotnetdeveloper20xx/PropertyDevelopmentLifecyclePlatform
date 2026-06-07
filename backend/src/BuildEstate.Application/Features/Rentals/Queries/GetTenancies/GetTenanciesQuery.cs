using BuildEstate.Application.Features.Rentals.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
namespace BuildEstate.Application.Features.Rentals.Queries.GetTenancies;
public record GetTenanciesQuery : IRequest<ApiResponse<List<TenancyDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
    public TenancyStatus? Status { get; init; }
}
