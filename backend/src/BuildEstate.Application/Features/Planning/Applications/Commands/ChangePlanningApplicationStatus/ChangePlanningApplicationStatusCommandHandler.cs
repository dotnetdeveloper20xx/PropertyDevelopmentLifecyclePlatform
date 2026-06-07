using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.ChangePlanningApplicationStatus;

/// <summary>
/// Handles planning application status transitions with state machine enforcement.
/// Only valid transitions are permitted.
/// </summary>
public class ChangePlanningApplicationStatusCommandHandler
    : IRequestHandler<ChangePlanningApplicationStatusCommand>
{
    private readonly IRepository<PlanningApplication> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangePlanningApplicationStatusCommandHandler> _logger;

    /// <summary>
    /// Defines valid state transitions for planning applications.
    /// </summary>
    private static readonly Dictionary<PlanningApplicationStatus, PlanningApplicationStatus[]> ValidTransitions = new()
    {
        [PlanningApplicationStatus.PreApplication] = [PlanningApplicationStatus.Submitted, PlanningApplicationStatus.Withdrawn],
        [PlanningApplicationStatus.Submitted] = [PlanningApplicationStatus.Validated, PlanningApplicationStatus.Withdrawn],
        [PlanningApplicationStatus.Validated] = [PlanningApplicationStatus.UnderReview, PlanningApplicationStatus.Withdrawn],
        [PlanningApplicationStatus.UnderReview] = [PlanningApplicationStatus.CommitteeReview, PlanningApplicationStatus.Approved, PlanningApplicationStatus.ApprovedWithConditions, PlanningApplicationStatus.Refused, PlanningApplicationStatus.Withdrawn],
        [PlanningApplicationStatus.CommitteeReview] = [PlanningApplicationStatus.Approved, PlanningApplicationStatus.ApprovedWithConditions, PlanningApplicationStatus.Refused, PlanningApplicationStatus.Withdrawn],
        [PlanningApplicationStatus.Approved] = [],
        [PlanningApplicationStatus.ApprovedWithConditions] = [],
        [PlanningApplicationStatus.Refused] = [PlanningApplicationStatus.Appeal],
        [PlanningApplicationStatus.Appeal] = [PlanningApplicationStatus.Approved, PlanningApplicationStatus.ApprovedWithConditions, PlanningApplicationStatus.Refused],
        [PlanningApplicationStatus.Withdrawn] = []
    };

    public ChangePlanningApplicationStatusCommandHandler(
        IRepository<PlanningApplication> repository,
        IUnitOfWork unitOfWork,
        ILogger<ChangePlanningApplicationStatusCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChangePlanningApplicationStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(PlanningApplication), request.Id);

        var currentStatus = entity.Status;
        var newStatus = request.NewStatus;

        if (!ValidTransitions.TryGetValue(currentStatus, out var allowed) || !allowed.Contains(newStatus))
        {
            throw new BadRequestException(
                $"Cannot transition planning application from '{currentStatus}' to '{newStatus}'. " +
                $"Valid transitions from '{currentStatus}': {string.Join(", ", allowed ?? [])}.");
        }

        entity.Status = newStatus;

        // Auto-set dates based on status transitions
        if (newStatus == PlanningApplicationStatus.Submitted && !entity.SubmissionDate.HasValue)
        {
            entity.SubmissionDate = DateTime.UtcNow;
        }
        else if (newStatus == PlanningApplicationStatus.Validated && !entity.ValidationDate.HasValue)
        {
            entity.ValidationDate = DateTime.UtcNow;
        }
        else if (newStatus is PlanningApplicationStatus.Approved or PlanningApplicationStatus.ApprovedWithConditions or PlanningApplicationStatus.Refused)
        {
            entity.DecisionDate ??= DateTime.UtcNow;
        }

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning application {ApplicationId} status changed from {OldStatus} to {NewStatus}",
            entity.Id, currentStatus, newStatus);
    }
}
