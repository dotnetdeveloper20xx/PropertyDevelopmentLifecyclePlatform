using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.ChangePlanningApplicationStatus;

/// <summary>
/// Command to change a planning application's status. Enforces state machine transitions.
/// </summary>
public record ChangePlanningApplicationStatusCommand(Guid Id, PlanningApplicationStatus NewStatus) : IRequest;
