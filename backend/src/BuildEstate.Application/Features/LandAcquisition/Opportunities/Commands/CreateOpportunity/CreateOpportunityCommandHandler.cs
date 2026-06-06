using BuildEstate.Application.Features.LandAcquisition.Opportunities.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.CreateOpportunity;

/// <summary>
/// Handles creation of a new land opportunity.
/// Creates the domain entity, persists via repository, and returns confirmation DTO.
/// </summary>
public class CreateOpportunityCommandHandler : IRequestHandler<CreateOpportunityCommand, CreateOpportunityDto>
{
    private readonly IRepository<LandOpportunity> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateOpportunityCommandHandler> _logger;

    public CreateOpportunityCommandHandler(
        IRepository<LandOpportunity> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateOpportunityCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<CreateOpportunityDto> Handle(
        CreateOpportunityCommand request,
        CancellationToken cancellationToken)
    {
        var entity = new LandOpportunity
        {
            Name = request.Name,
            Location = request.Location,
            Address = request.Address,
            PostCode = request.PostCode,
            LandSize = request.LandSize,
            LandSizeUnit = request.LandSizeUnit ?? "Acres",
            CurrentUse = request.CurrentUse,
            TitleNumber = request.TitleNumber,
            PlanningStatus = request.PlanningStatus,
            LocalPlanZoning = request.LocalPlanZoning,
            PlanningPotential = request.PlanningPotential,
            Status = OpportunityStatus.Identified,
            Source = request.Source,
            AgentName = request.AgentName,
            AgentContact = request.AgentContact,
            AskingPrice = request.AskingPrice,
            EstimatedValue = request.EstimatedValue,
            EstimatedDevelopmentCost = request.EstimatedDevelopmentCost,
            EstimatedProfit = request.EstimatedProfit,
            ROI = request.ROI,
            ExpectedAcquisitionDate = request.ExpectedAcquisitionDate,
            Notes = request.Notes,
            LandOwnerId = request.LandOwnerId
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Opportunity {OpportunityId} '{OpportunityName}' created at {Location}",
            entity.Id, entity.Name, entity.Location);

        return new CreateOpportunityDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Location = entity.Location,
            Status = entity.Status.ToString(),
            CreatedAt = entity.CreatedAt
        };
    }
}
