using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Contracts.Commands.ChangeContractStatus;

public record ChangeContractStatusCommand(Guid Id, ContractStatus NewStatus) : IRequest;
