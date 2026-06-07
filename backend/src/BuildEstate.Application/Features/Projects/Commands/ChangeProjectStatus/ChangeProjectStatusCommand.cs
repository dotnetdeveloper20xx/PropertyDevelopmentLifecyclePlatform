using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Commands.ChangeProjectStatus;
public record ChangeProjectStatusCommand(Guid Id, ProjectStatus NewStatus) : IRequest;
