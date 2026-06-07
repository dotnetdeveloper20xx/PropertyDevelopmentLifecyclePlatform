using BuildEstate.Application.Features.Contractors.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
namespace BuildEstate.Application.Features.Contractors.Queries.GetContractors;
public record GetContractorsQuery : IRequest<ApiResponse<List<ContractorDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
    public ContractorType? Type { get; init; }
    public ContractorStatus? Status { get; init; }
}
