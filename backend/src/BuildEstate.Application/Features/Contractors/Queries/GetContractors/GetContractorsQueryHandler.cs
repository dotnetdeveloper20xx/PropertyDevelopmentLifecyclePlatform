using BuildEstate.Application.Features.Contractors.DTOs;
using BuildEstate.Domain.Entities.Contractors;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Contractors.Queries.GetContractors;
public class GetContractorsQueryHandler : IRequestHandler<GetContractorsQuery, ApiResponse<List<ContractorDto>>>
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<Contractor> _repository;
    public GetContractorsQueryHandler(IRepository<Contractor> repository) { _repository = repository; }
    public async Task<ApiResponse<List<ContractorDto>>> Handle(GetContractorsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();
        if (request.Type.HasValue) query = query.Where(x => x.Type == request.Type.Value);
        if (request.Status.HasValue) query = query.Where(x => x.Status == request.Status.Value);
        if (!string.IsNullOrWhiteSpace(request.Search))
        { var s = request.Search.Trim(); query = query.Where(x => x.CompanyName.Contains(s) || (x.Trade != null && x.Trade.Contains(s))); }
        var totalCount = await query.CountAsync(cancellationToken);
        var page = request.Page is > 0 ? request.Page.Value : 1;
        var pageSize = request.PageSize switch { > 0 and <= MaxPageSize => request.PageSize.Value, > MaxPageSize => MaxPageSize, _ => DefaultPageSize };
        var items = await query.OrderBy(x => x.CompanyName).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new ContractorDto
            {
                Id = x.Id, CompanyName = x.CompanyName, Type = x.Type, Status = x.Status,
                ContactName = x.ContactName, Email = x.Email, Phone = x.Phone,
                Address = x.Address, Trade = x.Trade, Rating = x.Rating,
                InsuranceDetails = x.InsuranceDetails, InsuranceExpiry = x.InsuranceExpiry,
                Certifications = x.Certifications, Notes = x.Notes, CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
        return ApiResponse<List<ContractorDto>>.Paginated(items, new PaginationMeta { Page = page, PageSize = pageSize, TotalCount = totalCount });
    }
}
