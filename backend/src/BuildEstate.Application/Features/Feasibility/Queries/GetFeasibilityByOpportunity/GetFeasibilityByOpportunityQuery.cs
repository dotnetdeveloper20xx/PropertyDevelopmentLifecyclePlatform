using BuildEstate.Application.Features.Feasibility.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Feasibility.Queries.GetFeasibilityByOpportunity;

public record GetFeasibilityByOpportunityQuery(Guid OpportunityId) : IRequest<List<FeasibilityAssessmentDto>>;
