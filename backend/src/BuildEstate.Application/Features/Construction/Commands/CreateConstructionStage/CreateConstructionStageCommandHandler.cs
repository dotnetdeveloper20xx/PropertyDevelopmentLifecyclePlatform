using BuildEstate.Application.Features.Construction.DTOs;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Construction.Commands.CreateConstructionStage;
public class CreateConstructionStageCommandHandler : IRequestHandler<CreateConstructionStageCommand, ConstructionStageDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<ConstructionStage> _stageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateConstructionStageCommandHandler> _logger;
    public CreateConstructionStageCommandHandler(IRepository<Project> projectRepository, IRepository<ConstructionStage> stageRepository, IUnitOfWork unitOfWork, ILogger<CreateConstructionStageCommandHandler> logger)
    { _projectRepository = projectRepository; _stageRepository = stageRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<ConstructionStageDto> Handle(CreateConstructionStageCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var maxOrder = await _stageRepository.Query().Where(x => x.ProjectId == request.ProjectId).Select(x => (int?)x.SortOrder).MaxAsync(cancellationToken) ?? 0;
        var entity = new ConstructionStage
        {
            ProjectId = request.ProjectId,
            Name = request.Name,
            Description = request.Description,
            Status = ConstructionStageStatus.NotStarted,
            SortOrder = maxOrder + 1,
            PlannedStartDate = request.PlannedStartDate,
            PlannedEndDate = request.PlannedEndDate,
            Notes = request.Notes
        };
        await _stageRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("ConstructionStage {StageId} '{Name}' created for project {ProjectId}", entity.Id, entity.Name, entity.ProjectId);
        return new ConstructionStageDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            Name = entity.Name,
            Description = entity.Description,
            Status = entity.Status,
            SortOrder = entity.SortOrder,
            PlannedStartDate = entity.PlannedStartDate,
            PlannedEndDate = entity.PlannedEndDate,
            ActualStartDate = entity.ActualStartDate,
            ActualEndDate = entity.ActualEndDate,
            ProgressPercent = entity.ProgressPercent,
            Notes = entity.Notes,
            InspectionCount = 0,
            SnagCount = 0,
            CreatedAt = entity.CreatedAt
        };
    }
}
