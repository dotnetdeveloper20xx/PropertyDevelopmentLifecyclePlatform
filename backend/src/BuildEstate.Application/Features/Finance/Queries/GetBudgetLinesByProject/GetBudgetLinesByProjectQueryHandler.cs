using BuildEstate.Application.Features.Finance.DTOs;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Finance.Queries.GetBudgetLinesByProject;
public class GetBudgetLinesByProjectQueryHandler : IRequestHandler<GetBudgetLinesByProjectQuery, List<BudgetLineDto>>
{
    private readonly IRepository<BudgetLine> _repository;
    public GetBudgetLinesByProjectQueryHandler(IRepository<BudgetLine> repository) { _repository = repository; }
    public async Task<List<BudgetLineDto>> Handle(GetBudgetLinesByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderBy(x => x.Category)
            .Select(x => new BudgetLineDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Category = x.Category,
                Description = x.Description,
                PlannedAmount = x.PlannedAmount,
                ActualAmount = x.ActualAmount,
                Status = x.Status,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}
