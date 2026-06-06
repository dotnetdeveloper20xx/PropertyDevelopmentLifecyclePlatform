using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.UpdateOpportunity;

/// <summary>
/// Handles updating an existing land opportunity.
/// 
/// Design decision: This is a full PUT (replace all fields). The validator
/// ensures all required fields are present and valid before this handler executes.
/// Status cannot be changed via this endpoint — use ChangeStatus command instead.
/// </summary>
public class UpdateOpportunityCommandHandler : IRequestHandler<UpdateOpportunityCommand, Unit>
{
    private readonly IRepository<LandOpportunity> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateOpportunityCommandHandler> _logger;

    public UpdateOpportunityCommandHandler(
        IRepository<LandOpportunity> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateOpportunityCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (entity is null)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.Id);
        }

        // Apply updates — this is a full PUT replacement
        // Required fields (validated by UpdateOpportunityCommandValidator)
        entity.Name = request.Name;
        entity.Location = request.Location;
        entity.LandSize = request.LandSize;

        // Optional fields — always set (even if null, to allow clearing values)
        entity.Address = request.Address;
        entity.PostCode = request.PostCode;
        entity.LandSizeUnit = request.LandSizeUnit ?? "Acres";
        entity.CurrentUse = request.CurrentUse;
        entity.TitleNumber = request.TitleNumber;
        entity.PlanningStatus = request.PlanningStatus;
        entity.LocalPlanZoning = request.LocalPlanZoning;
        entity.PlanningPotential = request.PlanningPotential;
        entity.Source = request.Source;
        entity.AgentName = request.AgentName;
        entity.AgentContact = request.AgentContact;
        entity.AskingPrice = request.AskingPrice;
        entity.EstimatedValue = request.EstimatedValue;
        entity.EstimatedDevelopmentCost = request.EstimatedDevelopmentCost;
        entity.EstimatedProfit = request.EstimatedProfit;
        entity.ROI = request.ROI;
        entity.ExpectedAcquisitionDate = request.ExpectedAcquisitionDate;
        entity.Notes = request.Notes;
        entity.LandOwnerId = request.LandOwnerId;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Opportunity {OpportunityId} updated", entity.Id);

        return Unit.Value;
    }
}
