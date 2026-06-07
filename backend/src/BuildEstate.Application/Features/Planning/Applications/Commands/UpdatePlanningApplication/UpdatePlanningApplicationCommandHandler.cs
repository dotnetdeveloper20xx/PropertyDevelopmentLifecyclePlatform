using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.UpdatePlanningApplication;

/// <summary>
/// Handles updating an existing planning application.
/// </summary>
public class UpdatePlanningApplicationCommandHandler : IRequestHandler<UpdatePlanningApplicationCommand>
{
    private readonly IRepository<PlanningApplication> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdatePlanningApplicationCommandHandler> _logger;

    public UpdatePlanningApplicationCommandHandler(
        IRepository<PlanningApplication> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdatePlanningApplicationCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(UpdatePlanningApplicationCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(PlanningApplication), request.Id);

        entity.ApplicationReference = request.ApplicationReference;
        entity.Description = request.Description;
        entity.LocalAuthority = request.LocalAuthority;
        entity.ApplicationType = request.ApplicationType;
        entity.SubmissionDate = request.SubmissionDate;
        entity.ValidationDate = request.ValidationDate;
        entity.DecisionDate = request.DecisionDate;
        entity.ExpiryDate = request.ExpiryDate;
        entity.DecisionNotice = request.DecisionNotice;
        entity.PlanningOfficer = request.PlanningOfficer;
        entity.CaseOfficerEmail = request.CaseOfficerEmail;
        entity.Ward = request.Ward;
        entity.SiteAddress = request.SiteAddress;
        entity.ApplicationFee = request.ApplicationFee;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning application {ApplicationId} '{Reference}' updated",
            entity.Id, entity.ApplicationReference);
    }
}
