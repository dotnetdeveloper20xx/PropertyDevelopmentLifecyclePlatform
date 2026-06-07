using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Legal.Contracts.Queries.GetContracts;

public class GetContractsQueryHandler : IRequestHandler<GetContractsQuery, ApiResponse<List<ContractListItemDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private readonly IRepository<Contract> _repository;

    public GetContractsQueryHandler(IRepository<Contract> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<ContractListItemDto>>> Handle(
        GetContractsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        if (request.Status.HasValue)
            query = query.Where(x => x.Status == request.Status.Value);

        if (request.ContractType.HasValue)
            query = query.Where(x => x.ContractType == request.ContractType.Value);

        if (request.OpportunityId.HasValue)
            query = query.Where(x => x.OpportunityId == request.OpportunityId.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x =>
                x.Title.Contains(search) ||
                x.ContractReference.Contains(search) ||
                x.CounterpartyName.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        query = ApplySorting(query, request.SortBy, request.SortDir);

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
            .Select(x => new ContractListItemDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                Title = x.Title,
                ContractType = x.ContractType,
                Status = x.Status,
                ContractReference = x.ContractReference,
                CounterpartyName = x.CounterpartyName,
                ContractValue = x.ContractValue,
                Currency = x.Currency,
                ExchangeDate = x.ExchangeDate,
                CompletionDate = x.CompletionDate,
                DocumentCount = x.Documents.Count(d => !d.IsDeleted),
                TaskCount = x.Tasks.Count(t => !t.IsDeleted),
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        var pagination = new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount };
        return ApiResponse<List<ContractListItemDto>>.Paginated(items, pagination);
    }

    private static IQueryable<Contract> ApplySorting(IQueryable<Contract> query, string? sortBy, string? sortDir)
    {
        var ascending = string.Equals(sortDir, "asc", StringComparison.OrdinalIgnoreCase);
        return sortBy?.ToLower() switch
        {
            "title" => ascending ? query.OrderBy(x => x.Title) : query.OrderByDescending(x => x.Title),
            "reference" => ascending ? query.OrderBy(x => x.ContractReference) : query.OrderByDescending(x => x.ContractReference),
            "counterparty" => ascending ? query.OrderBy(x => x.CounterpartyName) : query.OrderByDescending(x => x.CounterpartyName),
            "status" => ascending ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            "value" => ascending ? query.OrderBy(x => x.ContractValue) : query.OrderByDescending(x => x.ContractValue),
            "createdat" => ascending ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };
    }
}
