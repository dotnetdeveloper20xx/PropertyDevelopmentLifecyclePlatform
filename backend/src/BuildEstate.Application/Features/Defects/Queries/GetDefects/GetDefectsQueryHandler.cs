using BuildEstate.Application.Features.Defects.DTOs;
using BuildEstate.Domain.Entities.Defects;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Defects.Queries.GetDefects;

public class GetDefectsQueryHandler : IRequestHandler<GetDefectsQuery, ApiResponse<List<DefectDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private readonly IRepository<Defect> _repository;

    public GetDefectsQueryHandler(IRepository<Defect> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<DefectDto>>> Handle(GetDefectsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        if (request.Status.HasValue)
            query = query.Where(x => x.Status == request.Status.Value);

        if (request.Priority.HasValue)
            query = query.Where(x => x.Priority == request.Priority.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim();
            query = query.Where(x => x.Title.Contains(s) || (x.Location != null && x.Location.Contains(s)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var ascending = string.Equals(request.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        query = request.SortBy?.ToLower() switch
        {
            "title" => ascending ? query.OrderBy(x => x.Title) : query.OrderByDescending(x => x.Title),
            "status" => ascending ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            "priority" => ascending ? query.OrderBy(x => x.Priority) : query.OrderByDescending(x => x.Priority),
            "reporteddate" => ascending ? query.OrderBy(x => x.ReportedDate) : query.OrderByDescending(x => x.ReportedDate),
            _ => query.OrderByDescending(x => x.ReportedDate)
        };

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
            .Select(x => new DefectDto
            {
                Id = x.Id,
                PropertyUnitId = x.PropertyUnitId,
                ProjectId = x.ProjectId,
                Title = x.Title,
                Description = x.Description,
                Location = x.Location,
                Status = x.Status,
                Priority = x.Priority,
                ReportedBy = x.ReportedBy,
                ReportedDate = x.ReportedDate,
                AssignedTo = x.AssignedTo,
                ResolvedDate = x.ResolvedDate,
                Resolution = x.Resolution,
                UnderWarranty = x.UnderWarranty,
                WarrantyReference = x.WarrantyReference,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return ApiResponse<List<DefectDto>>.Paginated(items, new PaginationMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        });
    }
}
