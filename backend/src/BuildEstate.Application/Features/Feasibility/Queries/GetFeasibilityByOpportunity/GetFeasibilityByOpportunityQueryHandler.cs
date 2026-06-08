using BuildEstate.Application.Features.Feasibility.DTOs;
using BuildEstate.Domain.Entities.Feasibility;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Feasibility.Queries.GetFeasibilityByOpportunity;

public class GetFeasibilityByOpportunityQueryHandler : IRequestHandler<GetFeasibilityByOpportunityQuery, List<FeasibilityAssessmentDto>>
{
    private readonly IRepository<FeasibilityAssessment> _repository;

    public GetFeasibilityByOpportunityQueryHandler(IRepository<FeasibilityAssessment> repository)
    {
        _repository = repository;
    }

    public async Task<List<FeasibilityAssessmentDto>> Handle(GetFeasibilityByOpportunityQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new FeasibilityAssessmentDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                Status = x.Status,
                EstimatedLandCost = x.EstimatedLandCost,
                EstimatedBuildCost = x.EstimatedBuildCost,
                ProfessionalFees = x.ProfessionalFees,
                FinanceCosts = x.FinanceCosts,
                GrossDevelopmentValue = x.GrossDevelopmentValue,
                ExpectedSalesRevenue = x.ExpectedSalesRevenue,
                EstimatedProfit = x.EstimatedProfit,
                ROI = x.ROI,
                Scenario = x.Scenario,
                ApprovalNotes = x.ApprovalNotes,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
