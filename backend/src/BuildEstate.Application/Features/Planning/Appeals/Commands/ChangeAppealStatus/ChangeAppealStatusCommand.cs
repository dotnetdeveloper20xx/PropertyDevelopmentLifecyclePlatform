using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Appeals.Commands.ChangeAppealStatus;

/// <summary>
/// Command to change an appeal's status.
/// </summary>
public record ChangeAppealStatusCommand(Guid Id, Guid PlanningApplicationId, AppealStatus NewStatus) : IRequest;
