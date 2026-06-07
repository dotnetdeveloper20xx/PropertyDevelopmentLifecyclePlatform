using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Contracts.Queries.GetContractById;

public record GetContractByIdQuery(Guid Id) : IRequest<ContractDetailDto>;
