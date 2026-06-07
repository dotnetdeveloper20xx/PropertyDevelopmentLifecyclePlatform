using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Projects.Queries.GetProjects;
public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, ApiResponse<List<ProjectListItemDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<Project> _repository;
    public GetProjectsQueryHandler(IRepository<Project> repository) { _repository = repository; }
    public async Task<ApiResponse<List<ProjectListItemDto>>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();
        if (request.Status.HasValue) query = query.Where(x => x.Status == request.Status.Value);
        if (!string.IsNullOrWhiteSpace(request.Search))
        { var s = request.Search.Trim(); query = query.Where(x => x.Name.Contains(s) || x.ProjectReference.Contains(s)); }
        var totalCount = await query.CountAsync(cancellationToken);
        var ascending = string.Equals(request.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        query = request.SortBy?.ToLower() switch
        {
            "name" => ascending ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
            "reference" => ascending ? query.OrderBy(x => x.ProjectReference) : query.OrderByDescending(x => x.ProjectReference),
            "status" => ascending ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            "budget" => ascending ? query.OrderBy(x => x.Budget) : query.OrderByDescending(x => x.Budget),
            "progress" => ascending ? query.OrderBy(x => x.ProgressPercent) : query.OrderByDescending(x => x.ProgressPercent),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };
        var page = request.Page is > 0 ? request.Page.Value : DefaultPage;
        var pageSize = request.PageSize switch { > 0 and <= MaxPageSize => request.PageSize.Value, > MaxPageSize => MaxPageSize, _ => DefaultPageSize };
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new ProjectListItemDto
            {
                Id = x.Id, OpportunityId = x.OpportunityId, Name = x.Name, ProjectReference = x.ProjectReference,
                Status = x.Status, ProjectManager = x.ProjectManager, StartDate = x.StartDate, TargetEndDate = x.TargetEndDate,
                Budget = x.Budget, ProgressPercent = x.ProgressPercent, TotalUnits = x.TotalUnits,
                MilestoneCount = x.Milestones.Count(m => !m.IsDeleted), TaskCount = x.Tasks.Count(t => !t.IsDeleted),
                RiskCount = x.Risks.Count(r => !r.IsDeleted), CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
        return ApiResponse<List<ProjectListItemDto>>.Paginated(items, new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount });
    }
}
