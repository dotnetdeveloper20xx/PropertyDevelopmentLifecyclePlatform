using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.ChangeOpportunityStatus;

/// <summary>
/// Command to transition an opportunity to a new status.
/// Enforces the state machine rules defined in MODULE-DESIGN.md.
/// </summary>
public record ChangeOpportunityStatusCommand(Guid Id, OpportunityStatus NewStatus) : IRequest<Unit>;
