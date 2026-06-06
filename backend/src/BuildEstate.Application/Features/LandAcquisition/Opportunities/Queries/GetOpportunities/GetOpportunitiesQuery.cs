using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunities;

/// <summary>
/// Query to retrieve a paginated, filterable, sortable list of opportunities.
/// Supports filtering by status and free-text search on name/location.
/// </summary>
public record GetOpportunitiesQuery : IRequest<ApiResponse<List<OpportunityListItemDto>>>
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? SortBy { get; init; }
    public string SortDir { get; init; } = "desc";
    public string? Search { get; init; }
    public OpportunityStatus? Status { get; init; }
}
