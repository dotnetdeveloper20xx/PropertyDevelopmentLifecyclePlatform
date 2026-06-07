using BuildEstate.Application.Features.Legal.ComplianceChecks.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Queries.GetComplianceChecksByOpportunity;

public record GetComplianceChecksByOpportunityQuery(Guid OpportunityId) : IRequest<List<ComplianceCheckDto>>;
