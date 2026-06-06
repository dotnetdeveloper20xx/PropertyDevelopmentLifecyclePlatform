using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.UpdateDueDiligence;

/// <summary>
/// Handles updating a due diligence check (status, findings, recommendation, risk level).
/// </summary>
public class UpdateDueDiligenceCommandHandler : IRequestHandler<UpdateDueDiligenceCommand, Unit>
{
    private readonly IRepository<DueDiligence> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateDueDiligenceCommandHandler> _logger;

    public UpdateDueDiligenceCommandHandler(
        IRepository<DueDiligence> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateDueDiligenceCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateDueDiligenceCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (entity is null || entity.OpportunityId != request.OpportunityId)
        {
            throw new NotFoundException(nameof(DueDiligence), request.Id);
        }

        entity.Status = request.Status;
        entity.AssignedTo = request.AssignedTo;
        entity.Findings = request.Findings;
        entity.Recommendation = request.Recommendation;
        entity.RiskLevel = request.RiskLevel;
        entity.Notes = request.Notes;
        entity.ReportDate = request.ReportDate;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Due diligence {DueDiligenceId} updated to status {Status}",
            entity.Id, entity.Status);

        return Unit.Value;
    }
}
