using BuildEstate.Application.Features.Rentals.DTOs;
using BuildEstate.Domain.Entities.Rentals;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Rentals.Queries.GetTenancies;
public class GetTenanciesQueryHandler : IRequestHandler<GetTenanciesQuery, ApiResponse<List<TenancyDto>>>
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<Tenancy> _repository;
    public GetTenanciesQueryHandler(IRepository<Tenancy> repository) { _repository = repository; }
    public async Task<ApiResponse<List<TenancyDto>>> Handle(GetTenanciesQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();
        if (request.Status.HasValue) query = query.Where(x => x.Status == request.Status.Value);
        if (!string.IsNullOrWhiteSpace(request.Search))
        { var s = request.Search.Trim(); query = query.Where(x => x.TenantName.Contains(s) || (x.TenantEmail != null && x.TenantEmail.Contains(s))); }
        var totalCount = await query.CountAsync(cancellationToken);
        var page = request.Page is > 0 ? request.Page.Value : 1;
        var pageSize = request.PageSize switch { > 0 and <= MaxPageSize => request.PageSize.Value, > MaxPageSize => MaxPageSize, _ => DefaultPageSize };
        var items = await query.OrderByDescending(x => x.LeaseStartDate).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new TenancyDto
            {
                Id = x.Id,
                PropertyUnitId = x.PropertyUnitId,
                TenantName = x.TenantName,
                TenantEmail = x.TenantEmail,
                TenantPhone = x.TenantPhone,
                MonthlyRent = x.MonthlyRent,
                LeaseStartDate = x.LeaseStartDate,
                LeaseEndDate = x.LeaseEndDate,
                Status = x.Status,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
        return ApiResponse<List<TenancyDto>>.Paginated(items, new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount });
    }
}
