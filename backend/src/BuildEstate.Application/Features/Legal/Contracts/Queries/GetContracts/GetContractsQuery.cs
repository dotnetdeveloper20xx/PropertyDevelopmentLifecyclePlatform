using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Contracts.Queries.GetContracts;

public record GetContractsQuery : IRequest<ApiResponse<List<ContractListItemDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? SortBy { get; init; }
    public string? SortDir { get; init; }
    public string? Search { get; init; }
    public ContractStatus? Status { get; init; }
    public ContractType? ContractType { get; init; }
    public Guid? OpportunityId { get; init; }
}
