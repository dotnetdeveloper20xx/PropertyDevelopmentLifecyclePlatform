using BuildEstate.Application.Features.Reports.DTOs;
using BuildEstate.Domain.Entities.Reports;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Reports.Queries.GetReports;

public class GetReportsQueryHandler : IRequestHandler<GetReportsQuery, ApiResponse<List<SavedReportDto>>>
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<SavedReport> _repository;

    public GetReportsQueryHandler(IRepository<SavedReport> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<SavedReportDto>>> Handle(GetReportsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x =>
                x.Title.Contains(search) ||
                (x.Description != null && x.Description.Contains(search)) ||
                x.ReportType.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var page = request.Page is > 0 ? request.Page.Value : 1;
        var pageSize = request.PageSize switch
        {
            > 0 and <= MaxPageSize => request.PageSize.Value,
            > MaxPageSize => MaxPageSize,
            _ => DefaultPageSize
        };

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new SavedReportDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                ReportType = x.ReportType,
                Parameters = x.Parameters,
                GeneratedBy = x.GeneratedBy,
                LastGeneratedAt = x.LastGeneratedAt,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return ApiResponse<List<SavedReportDto>>.Paginated(items, new PaginationMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        });
    }
}
