using BuildEstate.Application.Features.Planning.Appeals.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Planning.Appeals.Commands.CreatePlanningAppeal;

/// <summary>
/// Handles creation of a planning appeal.
/// Only applications in Refused status can be appealed.
/// </summary>
public class CreatePlanningAppealCommandHandler
    : IRequestHandler<CreatePlanningAppealCommand, PlanningAppealDto>
{
    private readonly IRepository<PlanningApplication> _applicationRepository;
    private readonly IRepository<PlanningAppeal> _appealRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePlanningAppealCommandHandler> _logger;

    public CreatePlanningAppealCommandHandler(
        IRepository<PlanningApplication> applicationRepository,
        IRepository<PlanningAppeal> appealRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreatePlanningAppealCommandHandler> logger)
    {
        _applicationRepository = applicationRepository;
        _appealRepository = appealRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PlanningAppealDto> Handle(
        CreatePlanningAppealCommand request,
        CancellationToken cancellationToken)
    {
        var application = await _applicationRepository.GetByIdAsync(request.PlanningApplicationId, cancellationToken)
            ?? throw new NotFoundException(nameof(PlanningApplication), request.PlanningApplicationId);

        if (application.Status != PlanningApplicationStatus.Refused)
        {
            throw new BadRequestException(
                "Appeals can only be submitted for refused planning applications.");
        }

        var entity = new PlanningAppeal
        {
            PlanningApplicationId = request.PlanningApplicationId,
            AppealReference = request.AppealReference,
            Status = AppealStatus.Submitted,
            AppealDate = DateTime.UtcNow,
            HearingDate = request.HearingDate,
            Inspector = request.Inspector,
            Grounds = request.Grounds,
            Notes = request.Notes
        };

        await _appealRepository.AddAsync(entity, cancellationToken);

        // Transition application to Appeal status
        application.Status = PlanningApplicationStatus.Appeal;
        await _applicationRepository.UpdateAsync(application, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Planning appeal {AppealId} '{Reference}' created for application {ApplicationId}",
            entity.Id, entity.AppealReference, entity.PlanningApplicationId);

        return new PlanningAppealDto
        {
            Id = entity.Id,
            PlanningApplicationId = entity.PlanningApplicationId,
            AppealReference = entity.AppealReference,
            Status = entity.Status,
            AppealDate = entity.AppealDate,
            HearingDate = entity.HearingDate,
            Inspector = entity.Inspector,
            Grounds = entity.Grounds,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
