using BuildEstate.Application.Features.Portfolio.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Portfolio.Queries.GetPortfolios;

public record GetPortfoliosQuery : IRequest<ApiResponse<List<PortfolioDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? SortBy { get; init; }
    public string? SortDir { get; init; }
    public string? Search { get; init; }
    public PortfolioStatus? Status { get; init; }
}
