using BuildEstate.Application.Features.Finance.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Finance.Queries.GetTransactionsByProject;
public record GetTransactionsByProjectQuery(Guid ProjectId) : IRequest<List<FinancialTransactionDto>>;
