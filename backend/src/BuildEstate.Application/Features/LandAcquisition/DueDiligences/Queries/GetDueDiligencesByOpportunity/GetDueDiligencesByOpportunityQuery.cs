using BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Queries.GetDueDiligencesByOpportunity;

/// <summary>
/// Query to retrieve all due diligence checks for a specific opportunity.
/// </summary>
public record GetDueDiligencesByOpportunityQuery(Guid OpportunityId) : IRequest<List<DueDiligenceListItemDto>>;
