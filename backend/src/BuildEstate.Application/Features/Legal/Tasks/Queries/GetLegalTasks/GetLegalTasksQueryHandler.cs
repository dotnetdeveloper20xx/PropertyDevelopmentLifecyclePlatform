using BuildEstate.Application.Features.Legal.Tasks.DTOs;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Legal.Tasks.Queries.GetLegalTasks;

public class GetLegalTasksQueryHandler : IRequestHandler<GetLegalTasksQuery, ApiResponse<List<LegalTaskDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private readonly IRepository<LegalTask> _repository;

    public GetLegalTasksQueryHandler(IRepository<LegalTask> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<LegalTaskDto>>> Handle(
        GetLegalTasksQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        if (request.Status.HasValue)
            query = query.Where(x => x.Status == request.Status.Value);

        if (request.Priority.HasValue)
            query = query.Where(x => x.Priority == request.Priority.Value);

        if (request.ContractId.HasValue)
            query = query.Where(x => x.ContractId == request.ContractId.Value);

        if (request.OpportunityId.HasValue)
            query = query.Where(x => x.OpportunityId == request.OpportunityId.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x => x.Title.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var page = request.Page is > 0 ? request.Page.Value : DefaultPage;
        var pageSize = request.PageSize switch
        {
            > 0 and <= MaxPageSize => request.PageSize.Value,
            > MaxPageSize => MaxPageSize,
            _ => DefaultPageSize
        };

        var items = await query
            .OrderByDescending(x => x.Priority)
            .ThenBy(x => x.DueDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new LegalTaskDto
            {
                Id = x.Id,
                ContractId = x.ContractId,
                OpportunityId = x.OpportunityId,
                Title = x.Title,
                Description = x.Description,
                Priority = x.Priority,
                Status = x.Status,
                AssignedTo = x.AssignedTo,
                DueDate = x.DueDate,
                CompletedDate = x.CompletedDate,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var pagination = new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount };
        return ApiResponse<List<LegalTaskDto>>.Paginated(items, pagination);
    }
}
