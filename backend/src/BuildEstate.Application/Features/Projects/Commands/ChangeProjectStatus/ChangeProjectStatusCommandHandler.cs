using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Projects.Commands.ChangeProjectStatus;
public class ChangeProjectStatusCommandHandler : IRequestHandler<ChangeProjectStatusCommand>
{
    private static readonly Dictionary<ProjectStatus, ProjectStatus[]> ValidTransitions = new()
    {
        [ProjectStatus.Planning] = [ProjectStatus.PreConstruction, ProjectStatus.OnHold, ProjectStatus.Cancelled],
        [ProjectStatus.PreConstruction] = [ProjectStatus.InProgress, ProjectStatus.OnHold, ProjectStatus.Cancelled],
        [ProjectStatus.InProgress] = [ProjectStatus.Completed, ProjectStatus.OnHold, ProjectStatus.Cancelled],
        [ProjectStatus.OnHold] = [ProjectStatus.Planning, ProjectStatus.PreConstruction, ProjectStatus.InProgress, ProjectStatus.Cancelled],
        [ProjectStatus.Completed] = [],
        [ProjectStatus.Cancelled] = []
    };
    private readonly IRepository<Project> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeProjectStatusCommandHandler> _logger;
    public ChangeProjectStatusCommandHandler(IRepository<Project> repository, IUnitOfWork unitOfWork, ILogger<ChangeProjectStatusCommandHandler> logger)
    { _repository = repository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task Handle(ChangeProjectStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException(nameof(Project), request.Id);
        var currentStatus = entity.Status;
        var newStatus = request.NewStatus;
        if (!ValidTransitions.TryGetValue(currentStatus, out var allowed) || !allowed.Contains(newStatus))
            throw new BadRequestException($"Cannot transition project from '{currentStatus}' to '{newStatus}'. Valid transitions: {string.Join(", ", allowed ?? [])}.");
        entity.Status = newStatus;
        if (newStatus == ProjectStatus.Completed) entity.ActualEndDate ??= DateTime.UtcNow;
        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Project {ProjectId} status changed from {OldStatus} to {NewStatus}", entity.Id, currentStatus, newStatus);
    }
}
