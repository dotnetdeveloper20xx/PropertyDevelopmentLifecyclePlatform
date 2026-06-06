using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunities;

/// <summary>
/// Handles paginated retrieval of opportunities with filtering and sorting.
/// Uses projection (Select) to only fetch columns needed for the list view.
/// Uses AsNoTracking for read-only performance.
/// 
/// Design decisions:
/// - Defaults are applied here (single source of truth), not on the query record
/// - Search relies on SQL Server collation (CI) — no ToLower() to preserve index usage
/// - Sorting uses switch expression for explicit allowed fields only
/// </summary>
public class GetOpportunitiesQueryHandler
    : IRequestHandler<GetOpportunitiesQuery, ApiResponse<List<OpportunityListItemDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private readonly IRepository<LandOpportunity> _repository;

    public GetOpportunitiesQueryHandler(IRepository<LandOpportunity> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<OpportunityListItemDto>>> Handle(
        GetOpportunitiesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        // Filter by status
        if (request.Status.HasValue)
        {
            query = query.Where(x => x.Status == request.Status.Value);
        }

        // Search by name or location (relies on SQL Server CI collation — no ToLower needed)
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x =>
                x.Name.Contains(search) ||
                x.Location.Contains(search));
        }

        // Total count before pagination (for PaginationMeta)
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDir);

        // Apply pagination with safe defaults
        var page = request.Page is > 0 ? request.Page.Value : DefaultPage;
        var pageSize = request.PageSize switch
        {
            > 0 and <= MaxPageSize => request.PageSize.Value,
            > MaxPageSize => MaxPageSize,
            _ => DefaultPageSize
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new OpportunityListItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Location = x.Location,
                LandSize = x.LandSize,
                LandSizeUnit = x.LandSizeUnit,
                Status = x.Status,
                AskingPrice = x.AskingPrice,
                ROI = x.ROI,
                Source = x.Source,
                ExpectedAcquisitionDate = x.ExpectedAcquisitionDate,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var pagination = new PaginationMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };

        return ApiResponse<List<OpportunityListItemDto>>.Paginated(items, pagination);
    }

    private static IQueryable<LandOpportunity> ApplySorting(
        IQueryable<LandOpportunity> query,
        string? sortBy,
        string? sortDir)
    {
        var ascending = string.Equals(sortDir, "asc", StringComparison.OrdinalIgnoreCase);

        return sortBy?.ToLower() switch
        {
            "name" => ascending ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
            "location" => ascending ? query.OrderBy(x => x.Location) : query.OrderByDescending(x => x.Location),
            "landsize" => ascending ? query.OrderBy(x => x.LandSize) : query.OrderByDescending(x => x.LandSize),
            "askingprice" => ascending ? query.OrderBy(x => x.AskingPrice) : query.OrderByDescending(x => x.AskingPrice),
            "status" => ascending ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            "createdat" => ascending ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
            _ => query.OrderByDescending(x => x.CreatedAt) // Default sort
        };
    }
}
