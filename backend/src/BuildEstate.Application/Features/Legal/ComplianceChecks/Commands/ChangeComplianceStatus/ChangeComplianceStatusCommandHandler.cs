using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.ChangeComplianceStatus;

public class ChangeComplianceStatusCommandHandler : IRequestHandler<ChangeComplianceStatusCommand>
{
    private readonly IRepository<ComplianceCheck> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeComplianceStatusCommandHandler> _logger;

    public ChangeComplianceStatusCommandHandler(
        IRepository<ComplianceCheck> repository,
        IUnitOfWork unitOfWork,
        ILogger<ChangeComplianceStatusCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChangeComplianceStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(ComplianceCheck), request.Id);

        if (entity.OpportunityId != request.OpportunityId)
            throw new BadRequestException("Compliance check does not belong to the specified opportunity.");

        entity.Status = request.NewStatus;
        entity.Outcome = request.Outcome ?? entity.Outcome;
        entity.RiskLevel = request.RiskLevel ?? entity.RiskLevel;

        if (request.NewStatus is ComplianceCheckStatus.Passed or ComplianceCheckStatus.Failed or ComplianceCheckStatus.Flagged)
            entity.CompletedDate ??= DateTime.UtcNow;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Compliance check {CheckId} status changed to {NewStatus} for opportunity {OpportunityId}",
            entity.Id, request.NewStatus, entity.OpportunityId);
    }
}
