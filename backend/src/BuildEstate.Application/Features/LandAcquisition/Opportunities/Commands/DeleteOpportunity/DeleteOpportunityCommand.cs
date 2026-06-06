using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.DeleteOpportunity;

/// <summary>
/// Command to soft-delete a land opportunity.
/// Only SuperAdmin can execute this action.
/// </summary>
public record DeleteOpportunityCommand(Guid Id) : IRequest<Unit>;
