using BuildEstate.Application.Features.Finance.DTOs;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Finance.Queries.GetTransactionsByProject;
public class GetTransactionsByProjectQueryHandler : IRequestHandler<GetTransactionsByProjectQuery, List<FinancialTransactionDto>>
{
    private readonly IRepository<FinancialTransaction> _repository;
    public GetTransactionsByProjectQueryHandler(IRepository<FinancialTransaction> repository) { _repository = repository; }
    public async Task<List<FinancialTransactionDto>> Handle(GetTransactionsByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderByDescending(x => x.TransactionDate)
            .Select(x => new FinancialTransactionDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Type = x.Type,
                Description = x.Description,
                Amount = x.Amount,
                Currency = x.Currency,
                TransactionDate = x.TransactionDate,
                Category = x.Category,
                Reference = x.Reference,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}
