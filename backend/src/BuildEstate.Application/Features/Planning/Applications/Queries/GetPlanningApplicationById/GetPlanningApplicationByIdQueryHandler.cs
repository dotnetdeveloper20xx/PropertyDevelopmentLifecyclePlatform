using BuildEstate.Application.Features.Planning.Applications.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Planning.Applications.Queries.GetPlanningApplicationById;

/// <summary>
/// Handles retrieval of a single planning application with full detail.
/// </summary>
public class GetPlanningApplicationByIdQueryHandler
    : IRequestHandler<GetPlanningApplicationByIdQuery, PlanningApplicationDetailDto>
{
    private readonly IRepository<PlanningApplication> _repository;

    public GetPlanningApplicationByIdQueryHandler(IRepository<PlanningApplication> repository)
    {
        _repository = repository;
    }

    public async Task<PlanningApplicationDetailDto> Handle(
        GetPlanningApplicationByIdQuery request,
        CancellationToken cancellationToken)
    {
        var dto = await _repository.Query()
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new PlanningApplicationDetailDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                OpportunityName = x.Opportunity.Name,
                ApplicationReference = x.ApplicationReference,
                Description = x.Description,
                LocalAuthority = x.LocalAuthority,
                ApplicationType = x.ApplicationType,
                Status = x.Status,
                SubmissionDate = x.SubmissionDate,
                ValidationDate = x.ValidationDate,
                DecisionDate = x.DecisionDate,
                ExpiryDate = x.ExpiryDate,
                DecisionNotice = x.DecisionNotice,
                PlanningOfficer = x.PlanningOfficer,
                CaseOfficerEmail = x.CaseOfficerEmail,
                Ward = x.Ward,
                SiteAddress = x.SiteAddress,
                ApplicationFee = x.ApplicationFee,
                Notes = x.Notes,
                ConditionCount = x.Conditions.Count(c => !c.IsDeleted),
                AppealCount = x.Appeals.Count(a => !a.IsDeleted),
                DocumentCount = x.Documents.Count(d => !d.IsDeleted),
                CreatedAt = x.CreatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException(nameof(PlanningApplication), request.Id);

        return dto;
    }
}
