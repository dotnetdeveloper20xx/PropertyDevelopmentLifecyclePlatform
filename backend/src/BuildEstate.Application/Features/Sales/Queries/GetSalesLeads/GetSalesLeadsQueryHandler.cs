using BuildEstate.Application.Features.Sales.DTOs;
using BuildEstate.Domain.Entities.Sales;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Sales.Queries.GetSalesLeads;
public class GetSalesLeadsQueryHandler : IRequestHandler<GetSalesLeadsQuery, ApiResponse<List<SalesLeadDto>>>
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<SalesLead> _repository;
    public GetSalesLeadsQueryHandler(IRepository<SalesLead> repository) { _repository = repository; }
    public async Task<ApiResponse<List<SalesLeadDto>>> Handle(GetSalesLeadsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();
        if (request.Status.HasValue) query = query.Where(x => x.Status == request.Status.Value);
        if (!string.IsNullOrWhiteSpace(request.Search))
        { var s = request.Search.Trim(); query = query.Where(x => x.Name.Contains(s) || (x.Email != null && x.Email.Contains(s))); }
        var totalCount = await query.CountAsync(cancellationToken);
        var page = request.Page is > 0 ? request.Page.Value : 1;
        var pageSize = request.PageSize switch { > 0 and <= MaxPageSize => request.PageSize.Value, > MaxPageSize => MaxPageSize, _ => DefaultPageSize };
        var items = await query.OrderByDescending(x => x.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new SalesLeadDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Name = x.Name,
                Email = x.Email,
                Phone = x.Phone,
                Source = x.Source,
                Status = x.Status,
                InterestDetails = x.InterestDetails,
                Budget = x.Budget,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
        return ApiResponse<List<SalesLeadDto>>.Paginated(items, new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount });
    }
}
