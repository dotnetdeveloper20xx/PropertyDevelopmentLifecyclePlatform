using BuildEstate.Application.Features.Finance.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Finance.Queries.GetBudgetLinesByProject;
public record GetBudgetLinesByProjectQuery(Guid ProjectId) : IRequest<List<BudgetLineDto>>;
