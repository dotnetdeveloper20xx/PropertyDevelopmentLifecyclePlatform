using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunities;

/// <summary>
/// Query to retrieve a paginated, filterable, sortable list of opportunities.
/// 
/// Query parameters:
/// - Page: 1-based page number (minimum 1)
/// - PageSize: items per page (1-100)
/// - SortBy: field name to sort by (name, location, landsize, askingprice, status, createdat)
/// - SortDir: sort direction ("asc" or "desc", defaults to "desc" in handler)
/// - Search: free-text search on name and location (case-insensitive)
/// - Status: filter by OpportunityStatus enum value
/// </summary>
public record GetOpportunitiesQuery : IRequest<ApiResponse<List<OpportunityListItemDto>>>
{
    /// <summary>1-based page number.</summary>
    public int? Page { get; init; }

    /// <summary>Items per page (1-100).</summary>
    public int? PageSize { get; init; }

    /// <summary>Field to sort by: name, location, landsize, askingprice, status, createdat.</summary>
    public string? SortBy { get; init; }

    /// <summary>Sort direction: "asc" or "desc".</summary>
    public string? SortDir { get; init; }

    /// <summary>Free-text search on name and location (case-insensitive).</summary>
    public string? Search { get; init; }

    /// <summary>Filter by opportunity status.</summary>
    public OpportunityStatus? Status { get; init; }
}
