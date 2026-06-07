using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Construction.Commands.CreateInspection;
public class CreateInspectionCommandHandler : IRequestHandler<CreateInspectionCommand, InspectionDto>
{
    private readonly IRepository<ConstructionStage> _stageRepository;
    private readonly IRepository<Inspection> _inspectionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateInspectionCommandHandler> _logger;
    public CreateInspectionCommandHandler(IRepository<ConstructionStage> stageRepository, IRepository<Inspection> inspectionRepository, IUnitOfWork unitOfWork, ILogger<CreateInspectionCommandHandler> logger)
    { _stageRepository = stageRepository; _inspectionRepository = inspectionRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<InspectionDto> Handle(CreateInspectionCommand request, CancellationToken cancellationToken)
    {
        var stageExists = await _stageRepository.ExistsAsync(x => x.Id == request.ConstructionStageId, cancellationToken);
        if (!stageExists) throw new NotFoundException(nameof(ConstructionStage), request.ConstructionStageId);
        var entity = new Inspection
        {
            ConstructionStageId = request.ConstructionStageId,
            Type = request.Type,
            Status = InspectionStatus.Scheduled,
            Inspector = request.Inspector,
            ScheduledDate = request.ScheduledDate,
            DefectsFound = 0,
            Notes = request.Notes
        };
        await _inspectionRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Inspection {InspectionId} of type {Type} created for stage {StageId}", entity.Id, entity.Type, entity.ConstructionStageId);
        return new InspectionDto
        {
            Id = entity.Id,
            ConstructionStageId = entity.ConstructionStageId,
            Type = entity.Type,
            Status = entity.Status,
            Inspector = entity.Inspector,
            ScheduledDate = entity.ScheduledDate,
            CompletedDate = entity.CompletedDate,
            Findings = entity.Findings,
            DefectsFound = entity.DefectsFound,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
