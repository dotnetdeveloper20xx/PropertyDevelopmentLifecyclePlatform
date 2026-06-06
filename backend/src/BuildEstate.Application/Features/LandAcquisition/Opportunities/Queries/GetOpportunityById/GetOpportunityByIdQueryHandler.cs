using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunityById;

/// <summary>
/// Handles retrieval of a single opportunity with full detail.
/// Uses projection to avoid loading unnecessary navigation properties.
/// </summary>
public class GetOpportunityByIdQueryHandler : IRequestHandler<GetOpportunityByIdQuery, OpportunityDetailDto>
{
    private readonly IRepository<LandOpportunity> _repository;

    public GetOpportunityByIdQueryHandler(IRepository<LandOpportunity> repository)
    {
        _repository = repository;
    }

    public async Task<OpportunityDetailDto> Handle(
        GetOpportunityByIdQuery request,
        CancellationToken cancellationToken)
    {
        var result = await _repository.Query()
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new OpportunityDetailDto
            {
                Id = x.Id,
                Name = x.Name,
                Location = x.Location,
                Address = x.Address,
                PostCode = x.PostCode,
                LandSize = x.LandSize,
                LandSizeUnit = x.LandSizeUnit,
                CurrentUse = x.CurrentUse,
                TitleNumber = x.TitleNumber,
                PlanningStatus = x.PlanningStatus,
                LocalPlanZoning = x.LocalPlanZoning,
                PlanningPotential = x.PlanningPotential,
                Status = x.Status,
                Source = x.Source,
                AgentName = x.AgentName,
                AgentContact = x.AgentContact,
                AskingPrice = x.AskingPrice,
                EstimatedValue = x.EstimatedValue,
                EstimatedDevelopmentCost = x.EstimatedDevelopmentCost,
                EstimatedProfit = x.EstimatedProfit,
                ROI = x.ROI,
                ExpectedAcquisitionDate = x.ExpectedAcquisitionDate,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedAt = x.UpdatedAt,
                LandOwnerId = x.LandOwnerId,
                LandOwnerName = x.LandOwner != null ? x.LandOwner.Name : null,
                DueDiligenceCount = x.DueDiligences.Count,
                OfferCount = x.Offers.Count,
                DocumentCount = x.Documents.Count
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (result is null)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.Id);
        }

        return result;
    }
}
