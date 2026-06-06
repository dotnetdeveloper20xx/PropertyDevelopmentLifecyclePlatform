using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.ChangeOpportunityStatus;

/// <summary>
/// Handles opportunity status transitions with state machine enforcement.
/// 
/// Valid transitions:
/// Identified → InitialReview → DueDiligence → OfferMade → UnderContract → Acquired
/// Any state → Withdrawn (terminal)
/// </summary>
public class ChangeOpportunityStatusCommandHandler : IRequestHandler<ChangeOpportunityStatusCommand, Unit>
{
    private readonly IRepository<LandOpportunity> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeOpportunityStatusCommandHandler> _logger;

    // Define valid state transitions
    private static readonly Dictionary<OpportunityStatus, OpportunityStatus[]> ValidTransitions = new()
    {
        { OpportunityStatus.Identified, new[] { OpportunityStatus.InitialReview, OpportunityStatus.Withdrawn } },
        { OpportunityStatus.InitialReview, new[] { OpportunityStatus.DueDiligence, OpportunityStatus.Withdrawn } },
        { OpportunityStatus.DueDiligence, new[] { OpportunityStatus.OfferMade, OpportunityStatus.Withdrawn } },
        { OpportunityStatus.OfferMade, new[] { OpportunityStatus.UnderContract, OpportunityStatus.Withdrawn } },
        { OpportunityStatus.UnderContract, new[] { OpportunityStatus.Acquired, OpportunityStatus.Withdrawn } },
        { OpportunityStatus.Acquired, Array.Empty<OpportunityStatus>() },
        { OpportunityStatus.Withdrawn, Array.Empty<OpportunityStatus>() }
    };

    public ChangeOpportunityStatusCommandHandler(
        IRepository<LandOpportunity> repository,
        IUnitOfWork unitOfWork,
        ILogger<ChangeOpportunityStatusCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(ChangeOpportunityStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (entity is null)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.Id);
        }

        var currentStatus = entity.Status;
        var newStatus = request.NewStatus;

        // Validate transition
        if (!ValidTransitions.TryGetValue(currentStatus, out var allowedTransitions)
            || !allowedTransitions.Contains(newStatus))
        {
            throw new ValidationException(new[]
            {
                $"Cannot transition from '{currentStatus}' to '{newStatus}'. " +
                $"Allowed transitions: {string.Join(", ", allowedTransitions?.Select(s => s.ToString()) ?? Array.Empty<string>())}"
            });
        }

        entity.Status = newStatus;
        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Opportunity {OpportunityId} status changed from {OldStatus} to {NewStatus}",
            entity.Id, currentStatus, newStatus);

        return Unit.Value;
    }
}
