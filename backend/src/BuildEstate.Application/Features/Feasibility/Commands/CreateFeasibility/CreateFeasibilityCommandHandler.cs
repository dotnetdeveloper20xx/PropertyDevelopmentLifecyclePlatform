using BuildEstate.Application.Features.Feasibility.DTOs;
using BuildEstate.Domain.Entities.Feasibility;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Feasibility.Commands.CreateFeasibility;

public class CreateFeasibilityCommandHandler : IRequestHandler<CreateFeasibilityCommand, FeasibilityAssessmentDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<FeasibilityAssessment> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateFeasibilityCommandHandler> _logger;

    public CreateFeasibilityCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<FeasibilityAssessment> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateFeasibilityCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<FeasibilityAssessmentDto> Handle(CreateFeasibilityCommand request, CancellationToken cancellationToken)
    {
        var opportunityExists = await _opportunityRepository.ExistsAsync(x => x.Id == request.OpportunityId, cancellationToken);
        if (!opportunityExists)
            throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);

        var totalCosts = request.EstimatedLandCost + request.EstimatedBuildCost + request.ProfessionalFees + request.FinanceCosts;
        var estimatedProfit = request.GrossDevelopmentValue - totalCosts;
        var roi = totalCosts > 0 ? (estimatedProfit / totalCosts) * 100 : 0;

        var entity = new FeasibilityAssessment
        {
            OpportunityId = request.OpportunityId,
            EstimatedLandCost = request.EstimatedLandCost,
            EstimatedBuildCost = request.EstimatedBuildCost,
            ProfessionalFees = request.ProfessionalFees,
            FinanceCosts = request.FinanceCosts,
            GrossDevelopmentValue = request.GrossDevelopmentValue,
            ExpectedSalesRevenue = request.ExpectedSalesRevenue,
            EstimatedProfit = estimatedProfit,
            ROI = roi,
            Scenario = request.Scenario,
            Notes = request.Notes,
            Status = FeasibilityStatus.Draft
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("FeasibilityAssessment {AssessmentId} created for opportunity {OpportunityId} with ROI {ROI}%",
            entity.Id, entity.OpportunityId, entity.ROI);

        return new FeasibilityAssessmentDto
        {
            Id = entity.Id,
            OpportunityId = entity.OpportunityId,
            Status = entity.Status,
            EstimatedLandCost = entity.EstimatedLandCost,
            EstimatedBuildCost = entity.EstimatedBuildCost,
            ProfessionalFees = entity.ProfessionalFees,
            FinanceCosts = entity.FinanceCosts,
            GrossDevelopmentValue = entity.GrossDevelopmentValue,
            ExpectedSalesRevenue = entity.ExpectedSalesRevenue,
            EstimatedProfit = entity.EstimatedProfit,
            ROI = entity.ROI,
            Scenario = entity.Scenario,
            ApprovalNotes = entity.ApprovalNotes,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
