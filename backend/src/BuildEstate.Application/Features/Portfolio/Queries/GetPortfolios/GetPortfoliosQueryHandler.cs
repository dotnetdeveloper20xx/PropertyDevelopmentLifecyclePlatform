using BuildEstate.Application.Features.Portfolio.DTOs;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Portfolio.Queries.GetPortfolios;

using PortfolioEntity = Domain.Entities.Portfolio.Portfolio;

public class GetPortfoliosQueryHandler : IRequestHandler<GetPortfoliosQuery, ApiResponse<List<PortfolioDto>>>
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    private readonly IRepository<PortfolioEntity> _repository;

    public GetPortfoliosQueryHandler(IRepository<PortfolioEntity> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<PortfolioDto>>> Handle(GetPortfoliosQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        if (request.Status.HasValue)
            query = query.Where(x => x.Status == request.Status.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim();
            query = query.Where(x => x.Name.Contains(s) || (x.Region != null && x.Region.Contains(s)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var ascending = string.Equals(request.SortDir, "asc", StringComparison.OrdinalIgnoreCase);
        query = request.SortBy?.ToLower() switch
        {
            "name" => ascending ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
            "region" => ascending ? query.OrderBy(x => x.Region) : query.OrderByDescending(x => x.Region),
            "status" => ascending ? query.OrderBy(x => x.Status) : query.OrderByDescending(x => x.Status),
            "targetinvestment" => ascending ? query.OrderBy(x => x.TargetInvestment) : query.OrderByDescending(x => x.TargetInvestment),
            "risklevel" => ascending ? query.OrderBy(x => x.RiskLevel) : query.OrderByDescending(x => x.RiskLevel),
            _ => query.OrderByDescending(x => x.CreatedAt)
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
            .Select(x => new PortfolioDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Region = x.Region,
                TargetUnits = x.TargetUnits,
                TargetInvestment = x.TargetInvestment,
                TargetProfit = x.TargetProfit,
                RiskLevel = x.RiskLevel,
                Status = x.Status,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return ApiResponse<List<PortfolioDto>>.Paginated(items, new PaginationMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        });
    }
}
