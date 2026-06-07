using BuildEstate.Application.Features.Investors.DTOs;
using BuildEstate.Shared.Models;
using MediatR;
namespace BuildEstate.Application.Features.Investors.Queries.GetInvestors;
public record GetInvestorsQuery : IRequest<ApiResponse<List<InvestorDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
}
