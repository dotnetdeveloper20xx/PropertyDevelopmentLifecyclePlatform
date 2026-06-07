using BuildEstate.Application.Features.Planning.Applications.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Planning.Applications.Queries.GetPlanningApplications;

/// <summary>
/// Handles paginated retrieval of planning applications with filtering and sorting.
/// </summary>
public class GetPlanningApplicationsQueryHandler
    : IRequestHandler<GetPlanningApplicationsQuery, ApiResponse<List<PlanningApplicationListItemDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private readonly IRepository<PlanningApplication> _repository;

    public GetPlanningApplicationsQueryHandler(IRepository<PlanningApplication> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<PlanningApplicationListItemDto>>> Handle(
        GetPlanningApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        // Filter by status
        if (request.Status.HasValue)
        {
            query = query.Where(x => x.Status == request.Status.Value);
        }

        // Filter by opportunity
        if (request.OpportunityId.HasValue)
        {
            query = query.Where(x => x.OpportunityId == request.OpportunityId.Value);
        }

        // Search by reference, description, or local authority
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x =>
                x.ApplicationReference.Contains(search) ||
                x.Description.Contains(search) ||
                x.LocalAuthority.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDir);

        // Apply pagination
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
            .Select(x => new PlanningApplicationListItemDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                ApplicationReference = x.ApplicationReference,
                Description = x.Description,
                LocalAuthority = x.LocalAuthority,
                ApplicationType = x.ApplicationType,
                Status = x.Status,
                SubmissionDate = x.SubmissionDate,
                DecisionDate = x.DecisionDate,
                ConditionCount = x.Conditions.Count(c => !c.IsDeleted),
                AppealCount = x.Appeals.Count(a => !a.IsDeleted),
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var pagination = new PaginationMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };

        return ApiResponse<List<PlanningApplicationListItemDto>>.Paginated(items, pagination);
    }

    private static IQueryable<PlanningApplication> ApplySorting(
        IQueryable<PlanningApplication> query,
        string? sortBy,
        string? sortDir)
    {
        var ascending = string.Equals(sortDir, "asc", StringComparison.OrdinalIgnoreCase);

        return sortBy?.ToLower() switch
        {
            "reference" => ascending ? query.OrderBy(x => x.ApplicationReference) : query.OrderByDescending(x => x.ApplicationReference),
            "localauthority" => ascending ? query.OrderBy(x => x.LocalAuthority) : query.OrderByDescending(x => x.LocalAuthority),
            "status" => ascending ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            "submissiondate" => ascending ? query.OrderBy(x => x.SubmissionDate) : query.OrderByDescending(x => x.SubmissionDate),
            "decisiondate" => ascending ? query.OrderBy(x => x.DecisionDate) : query.OrderByDescending(x => x.DecisionDate),
            "createdat" => ascending ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };
    }
}
