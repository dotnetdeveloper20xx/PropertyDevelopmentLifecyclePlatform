using BuildEstate.Application.Features.Legal.ComplianceChecks.DTOs;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Queries.GetComplianceChecksByOpportunity;

public class GetComplianceChecksByOpportunityQueryHandler
    : IRequestHandler<GetComplianceChecksByOpportunityQuery, List<ComplianceCheckDto>>
{
    private readonly IRepository<ComplianceCheck> _repository;

    public GetComplianceChecksByOpportunityQueryHandler(IRepository<ComplianceCheck> repository)
    {
        _repository = repository;
    }

    public async Task<List<ComplianceCheckDto>> Handle(
        GetComplianceChecksByOpportunityQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .OrderBy(x => x.CheckType)
            .Select(x => new ComplianceCheckDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                CheckType = x.CheckType,
                Status = x.Status,
                AssignedTo = x.AssignedTo,
                DueDate = x.DueDate,
                CompletedDate = x.CompletedDate,
                Outcome = x.Outcome,
                RiskLevel = x.RiskLevel,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
