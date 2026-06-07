using BuildEstate.Application.Features.LandAcquisition.Activity.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Activity.Queries.GetActivityByOpportunity;

/// <summary>
/// Query to retrieve audit trail entries for an opportunity and its sub-entities.
/// </summary>
public record GetActivityByOpportunityQuery(Guid OpportunityId) : IRequest<List<ActivityItemDto>>;
