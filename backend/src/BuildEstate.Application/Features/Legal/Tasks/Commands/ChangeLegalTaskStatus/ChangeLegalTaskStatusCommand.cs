using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Tasks.Commands.ChangeLegalTaskStatus;

public record ChangeLegalTaskStatusCommand(Guid Id, LegalTaskStatus NewStatus) : IRequest;
