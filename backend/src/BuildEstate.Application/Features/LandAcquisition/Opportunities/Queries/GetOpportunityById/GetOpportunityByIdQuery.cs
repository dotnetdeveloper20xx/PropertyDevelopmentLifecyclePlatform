using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityById;

/// <summary>
/// Query to retrieve a single opportunity by ID with full detail.
/// </summary>
public record GetOpportunityByIdQuery(Guid Id) : IRequest<OpportunityDetailDto>;
