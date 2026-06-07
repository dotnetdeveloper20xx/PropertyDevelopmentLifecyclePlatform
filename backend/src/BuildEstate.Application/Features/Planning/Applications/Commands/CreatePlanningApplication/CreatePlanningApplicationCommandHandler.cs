using BuildEstate.Application.Features.Planning.Applications.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.CreatePlanningApplication;

/// <summary>
/// Handles creation of a new planning application.
/// Validates that the parent opportunity exists before creating.
/// </summary>
public class CreatePlanningApplicationCommandHandler
    : IRequestHandler<CreatePlanningApplicationCommand, CreatePlanningApplicationDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<PlanningApplication> _planningRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePlanningApplicationCommandHandler> _logger;

    public CreatePlanningApplicationCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<PlanningApplication> planningRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreatePlanningApplicationCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _planningRepository = planningRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<CreatePlanningApplicationDto> Handle(
        CreatePlanningApplicationCommand request,
        CancellationToken cancellationToken)
    {
        var opportunityExists = await _opportunityRepository.ExistsAsync(
            x => x.Id == request.OpportunityId, cancellationToken);

        if (!opportunityExists)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);
        }

        var entity = new PlanningApplication
        {
            OpportunityId = request.OpportunityId,
            ApplicationReference = request.ApplicationReference,
            Description = request.Description,
            LocalAuthority = request.LocalAuthority,
            ApplicationType = request.ApplicationType,
            Status = request.SubmissionDate.HasValue
                ? PlanningApplicationStatus.Submitted
                : PlanningApplicationStatus.PreApplication,
            SubmissionDate = request.SubmissionDate,
            PlanningOfficer = request.PlanningOfficer,
            CaseOfficerEmail = request.CaseOfficerEmail,
            Ward = request.Ward,
            SiteAddress = request.SiteAddress,
            ApplicationFee = request.ApplicationFee,
            Notes = request.Notes
        };

        await _planningRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning application {ApplicationId} '{Reference}' created for opportunity {OpportunityId}",
            entity.Id, entity.ApplicationReference, entity.OpportunityId);

        return new CreatePlanningApplicationDto
        {
            Id = entity.Id,
            ApplicationReference = entity.ApplicationReference,
            Status = entity.Status.ToString(),
            CreatedAt = entity.CreatedAt
        };
    }
}
