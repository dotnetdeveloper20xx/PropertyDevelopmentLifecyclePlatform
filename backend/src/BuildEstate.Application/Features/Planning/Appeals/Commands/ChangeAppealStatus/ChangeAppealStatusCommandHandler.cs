using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Appeals.Commands.ChangeAppealStatus;

/// <summary>
/// Handles appeal status transitions with state machine enforcement.
/// </summary>
public class ChangeAppealStatusCommandHandler : IRequestHandler<ChangeAppealStatusCommand>
{
    private static readonly Dictionary<AppealStatus, AppealStatus[]> ValidTransitions = new()
    {
        [AppealStatus.Submitted] = [AppealStatus.InProgress, AppealStatus.Dismissed],
        [AppealStatus.InProgress] = [AppealStatus.Allowed, AppealStatus.Dismissed],
        [AppealStatus.Allowed] = [],
        [AppealStatus.Dismissed] = []
    };

    private readonly IRepository<PlanningAppeal> _appealRepository;
    private readonly IRepository<PlanningApplication> _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeAppealStatusCommandHandler> _logger;

    public ChangeAppealStatusCommandHandler(
        IRepository<PlanningAppeal> appealRepository,
        IRepository<PlanningApplication> applicationRepository,
        IUnitOfWork unitOfWork,
        ILogger<ChangeAppealStatusCommandHandler> logger)
    {
        _appealRepository = appealRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChangeAppealStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _appealRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(PlanningAppeal), request.Id);

        if (entity.PlanningApplicationId != request.PlanningApplicationId)
        {
            throw new BadRequestException("Appeal does not belong to the specified planning application.");
        }

        var currentStatus = entity.Status;
        var newStatus = request.NewStatus;

        if (!ValidTransitions.TryGetValue(currentStatus, out var allowed) || !allowed.Contains(newStatus))
        {
            throw new BadRequestException(
                $"Cannot transition appeal from '{currentStatus}' to '{newStatus}'. " +
                $"Valid transitions: {string.Join(", ", allowed ?? [])}.");
        }

        entity.Status = newStatus;

        if (newStatus is AppealStatus.Allowed or AppealStatus.Dismissed)
        {
            entity.DecisionDate = DateTime.UtcNow;

            // If appeal is allowed, update the parent application status
            if (newStatus == AppealStatus.Allowed)
            {
                var application = await _applicationRepository.GetByIdAsync(
                    entity.PlanningApplicationId, cancellationToken);
                if (application != null)
                {
                    application.Status = PlanningApplicationStatus.Approved;
                    await _applicationRepository.UpdateAsync(application, cancellationToken);
                }
            }
        }

        await _appealRepository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning appeal {AppealId} status changed from {OldStatus} to {NewStatus}",
            entity.Id, currentStatus, newStatus);
    }
}
