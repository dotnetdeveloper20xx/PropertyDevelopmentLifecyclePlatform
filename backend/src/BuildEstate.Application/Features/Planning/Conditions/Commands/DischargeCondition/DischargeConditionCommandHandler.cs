using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Conditions.Commands.DischargeCondition;

/// <summary>
/// Handles discharging a planning condition.
/// Only conditions in Pending or Submitted status can be discharged.
/// </summary>
public class DischargeConditionCommandHandler : IRequestHandler<DischargeConditionCommand, PlanningConditionDto>
{
    private readonly IRepository<PlanningCondition> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DischargeConditionCommandHandler> _logger;

    public DischargeConditionCommandHandler(
        IRepository<PlanningCondition> repository,
        IUnitOfWork unitOfWork,
        ILogger<DischargeConditionCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PlanningConditionDto> Handle(
        DischargeConditionCommand request,
        CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(PlanningCondition), request.Id);

        if (entity.PlanningApplicationId != request.PlanningApplicationId)
        {
            throw new BadRequestException("Condition does not belong to the specified planning application.");
        }

        if (entity.Status is PlanningConditionStatus.Discharged)
        {
            throw new BadRequestException("This condition has already been fully discharged.");
        }

        entity.Status = request.PartialDischarge
            ? PlanningConditionStatus.PartiallyDischarged
            : PlanningConditionStatus.Discharged;
        entity.DischargeDate = DateTime.UtcNow;
        entity.DischargeReference = request.DischargeReference;

        if (!string.IsNullOrWhiteSpace(request.Notes))
        {
            entity.Notes = request.Notes;
        }

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning condition {ConditionId} discharged (partial={Partial}) for application {ApplicationId}",
            entity.Id, request.PartialDischarge, entity.PlanningApplicationId);

        return new PlanningConditionDto
        {
            Id = entity.Id,
            PlanningApplicationId = entity.PlanningApplicationId,
            ConditionNumber = entity.ConditionNumber,
            Title = entity.Title,
            Description = entity.Description,
            Status = entity.Status,
            DueDate = entity.DueDate,
            DischargeDate = entity.DischargeDate,
            DischargeReference = entity.DischargeReference,
            AssignedTo = entity.AssignedTo,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
