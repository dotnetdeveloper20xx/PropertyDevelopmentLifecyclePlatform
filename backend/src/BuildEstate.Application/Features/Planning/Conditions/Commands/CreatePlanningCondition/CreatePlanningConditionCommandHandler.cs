using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Conditions.Commands.CreatePlanningCondition;

/// <summary>
/// Handles creation of a planning condition. Auto-numbers conditions per application.
/// </summary>
public class CreatePlanningConditionCommandHandler
    : IRequestHandler<CreatePlanningConditionCommand, PlanningConditionDto>
{
    private readonly IRepository<PlanningApplication> _applicationRepository;
    private readonly IRepository<PlanningCondition> _conditionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePlanningConditionCommandHandler> _logger;

    public CreatePlanningConditionCommandHandler(
        IRepository<PlanningApplication> applicationRepository,
        IRepository<PlanningCondition> conditionRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreatePlanningConditionCommandHandler> logger)
    {
        _applicationRepository = applicationRepository;
        _conditionRepository = conditionRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PlanningConditionDto> Handle(
        CreatePlanningConditionCommand request,
        CancellationToken cancellationToken)
    {
        var applicationExists = await _applicationRepository.ExistsAsync(
            x => x.Id == request.PlanningApplicationId, cancellationToken);

        if (!applicationExists)
        {
            throw new NotFoundException(nameof(PlanningApplication), request.PlanningApplicationId);
        }

        // Auto-assign condition number
        var maxConditionNumber = await _conditionRepository.Query()
            .Where(x => x.PlanningApplicationId == request.PlanningApplicationId)
            .Select(x => (int?)x.ConditionNumber)
            .MaxAsync(cancellationToken) ?? 0;

        var entity = new PlanningCondition
        {
            PlanningApplicationId = request.PlanningApplicationId,
            ConditionNumber = maxConditionNumber + 1,
            Title = request.Title,
            Description = request.Description,
            Status = PlanningConditionStatus.Pending,
            DueDate = request.DueDate,
            AssignedTo = request.AssignedTo,
            Notes = request.Notes
        };

        await _conditionRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning condition {ConditionId} (#{Number}) created for application {ApplicationId}",
            entity.Id, entity.ConditionNumber, entity.PlanningApplicationId);

        return new PlanningConditionDto
        {
            Id = entity.Id,
            PlanningApplicationId = entity.PlanningApplicationId,
            ConditionNumber = entity.ConditionNumber,
            Title = entity.Title,
            Description = entity.Description,
            Status = entity.Status,
            DueDate = entity.DueDate,
            AssignedTo = entity.AssignedTo,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
