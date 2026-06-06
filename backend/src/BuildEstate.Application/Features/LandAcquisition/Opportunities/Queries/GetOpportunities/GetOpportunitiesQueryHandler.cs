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
/// </summary>
public class GetOpportunitiesQueryHandler
    : IRequestHandler<GetOpportunitiesQuery, ApiResponse<List<OpportunityListItemDto>>>
{
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

        // Search by name or location
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(search) ||
                x.Location.ToLower().Contains(search));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Sorting
        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDir == "asc" ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
            "location" => request.SortDir == "asc" ? query.OrderBy(x => x.Location) : query.OrderByDescending(x => x.Location),
            "landsize" => request.SortDir == "asc" ? query.OrderBy(x => x.LandSize) : query.OrderByDescending(x => x.LandSize),
            "askingprice" => request.SortDir == "asc" ? query.OrderBy(x => x.AskingPrice) : query.OrderByDescending(x => x.AskingPrice),
            "status" => request.SortDir == "asc" ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        // Pagination
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize > 100 ? 100 : request.PageSize;

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
}
