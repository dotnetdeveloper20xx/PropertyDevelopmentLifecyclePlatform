using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Construction.Commands.CreateSnag;
public class CreateSnagCommandHandler : IRequestHandler<CreateSnagCommand, SnagDto>
{
    private readonly IRepository<ConstructionStage> _stageRepository;
    private readonly IRepository<Snag> _snagRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateSnagCommandHandler> _logger;
    public CreateSnagCommandHandler(IRepository<ConstructionStage> stageRepository, IRepository<Snag> snagRepository, IUnitOfWork unitOfWork, ILogger<CreateSnagCommandHandler> logger)
    { _stageRepository = stageRepository; _snagRepository = snagRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<SnagDto> Handle(CreateSnagCommand request, CancellationToken cancellationToken)
    {
        var stageExists = await _stageRepository.ExistsAsync(x => x.Id == request.ConstructionStageId, cancellationToken);
        if (!stageExists) throw new NotFoundException(nameof(ConstructionStage), request.ConstructionStageId);
        var entity = new Snag
        {
            ConstructionStageId = request.ConstructionStageId,
            InspectionId = request.InspectionId,
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            Status = SnagStatus.Open,
            Priority = request.Priority,
            AssignedTo = request.AssignedTo,
            Notes = request.Notes
        };
        await _snagRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Snag {SnagId} '{Title}' created for stage {StageId}", entity.Id, entity.Title, entity.ConstructionStageId);
        return new SnagDto
        {
            Id = entity.Id,
            ConstructionStageId = entity.ConstructionStageId,
            InspectionId = entity.InspectionId,
            Title = entity.Title,
            Description = entity.Description,
            Location = entity.Location,
            Status = entity.Status,
            Priority = entity.Priority,
            AssignedTo = entity.AssignedTo,
            ResolvedDate = entity.ResolvedDate,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
