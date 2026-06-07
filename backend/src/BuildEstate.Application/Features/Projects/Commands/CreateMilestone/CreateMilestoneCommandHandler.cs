using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Projects.Commands.CreateMilestone;
public class CreateMilestoneCommandHandler : IRequestHandler<CreateMilestoneCommand, MilestoneDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<Milestone> _milestoneRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateMilestoneCommandHandler> _logger;
    public CreateMilestoneCommandHandler(IRepository<Project> projectRepository, IRepository<Milestone> milestoneRepository, IUnitOfWork unitOfWork, ILogger<CreateMilestoneCommandHandler> logger)
    { _projectRepository = projectRepository; _milestoneRepository = milestoneRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<MilestoneDto> Handle(CreateMilestoneCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var maxOrder = await _milestoneRepository.Query().Where(x => x.ProjectId == request.ProjectId).Select(x => (int?)x.SortOrder).MaxAsync(cancellationToken) ?? 0;
        var entity = new Milestone { ProjectId = request.ProjectId, Title = request.Title, Description = request.Description, Status = MilestoneStatus.Upcoming, TargetDate = request.TargetDate, SortOrder = maxOrder + 1, Notes = request.Notes };
        await _milestoneRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Milestone {MilestoneId} '{Title}' created for project {ProjectId}", entity.Id, entity.Title, entity.ProjectId);
        return new MilestoneDto { Id = entity.Id, ProjectId = entity.ProjectId, Title = entity.Title, Description = entity.Description, Status = entity.Status, TargetDate = entity.TargetDate, SortOrder = entity.SortOrder, Notes = entity.Notes, CreatedAt = entity.CreatedAt };
    }
}
