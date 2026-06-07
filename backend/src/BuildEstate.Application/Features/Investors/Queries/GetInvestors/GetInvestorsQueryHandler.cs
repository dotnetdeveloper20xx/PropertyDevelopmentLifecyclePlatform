using BuildEstate.Application.Features.Investors.DTOs;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Investors.Queries.GetInvestors;
public class GetInvestorsQueryHandler : IRequestHandler<GetInvestorsQuery, ApiResponse<List<InvestorDto>>>
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<Investor> _repository;
    public GetInvestorsQueryHandler(IRepository<Investor> repository) { _repository = repository; }
    public async Task<ApiResponse<List<InvestorDto>>> Handle(GetInvestorsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();
        if (!string.IsNullOrWhiteSpace(request.Search))
        { var s = request.Search.Trim(); query = query.Where(x => x.Name.Contains(s) || (x.ContactName != null && x.ContactName.Contains(s))); }
        var totalCount = await query.CountAsync(cancellationToken);
        var page = request.Page is > 0 ? request.Page.Value : 1;
        var pageSize = request.PageSize switch { > 0 and <= MaxPageSize => request.PageSize.Value, > MaxPageSize => MaxPageSize, _ => DefaultPageSize };
        var items = await query.OrderBy(x => x.Name).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new InvestorDto
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                ContactName = x.ContactName,
                Email = x.Email,
                Phone = x.Phone,
                TotalCommitted = x.TotalCommitted,
                TotalDeployed = x.TotalDeployed,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
        return ApiResponse<List<InvestorDto>>.Paginated(items, new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount });
    }
}
