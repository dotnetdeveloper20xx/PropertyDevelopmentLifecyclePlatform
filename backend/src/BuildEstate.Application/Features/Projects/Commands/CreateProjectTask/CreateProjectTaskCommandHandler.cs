using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProjectTask;
public class CreateProjectTaskCommandHandler : IRequestHandler<CreateProjectTaskCommand, ProjectTaskDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<ProjectTask> _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateProjectTaskCommandHandler> _logger;
    public CreateProjectTaskCommandHandler(IRepository<Project> projectRepository, IRepository<ProjectTask> taskRepository, IUnitOfWork unitOfWork, ILogger<CreateProjectTaskCommandHandler> logger)
    { _projectRepository = projectRepository; _taskRepository = taskRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<ProjectTaskDto> Handle(CreateProjectTaskCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var entity = new ProjectTask { ProjectId = request.ProjectId, MilestoneId = request.MilestoneId, Title = request.Title, Description = request.Description, Status = ProjectTaskStatus.NotStarted, Priority = request.Priority, AssignedTo = request.AssignedTo, DueDate = request.DueDate, Notes = request.Notes };
        await _taskRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Project task {TaskId} '{Title}' created for project {ProjectId}", entity.Id, entity.Title, entity.ProjectId);
        return new ProjectTaskDto { Id = entity.Id, ProjectId = entity.ProjectId, MilestoneId = entity.MilestoneId, Title = entity.Title, Description = entity.Description, Status = entity.Status, Priority = entity.Priority, AssignedTo = entity.AssignedTo, DueDate = entity.DueDate, Notes = entity.Notes, CreatedAt = entity.CreatedAt };
    }
}
