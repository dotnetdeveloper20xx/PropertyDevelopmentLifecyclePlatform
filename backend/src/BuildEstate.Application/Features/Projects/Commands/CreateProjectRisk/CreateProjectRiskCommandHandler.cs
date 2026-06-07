using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProjectRisk;
public class CreateProjectRiskCommandHandler : IRequestHandler<CreateProjectRiskCommand, ProjectRiskDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<ProjectRisk> _riskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateProjectRiskCommandHandler> _logger;
    public CreateProjectRiskCommandHandler(IRepository<Project> projectRepository, IRepository<ProjectRisk> riskRepository, IUnitOfWork unitOfWork, ILogger<CreateProjectRiskCommandHandler> logger)
    { _projectRepository = projectRepository; _riskRepository = riskRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<ProjectRiskDto> Handle(CreateProjectRiskCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var entity = new ProjectRisk { ProjectId = request.ProjectId, Title = request.Title, Description = request.Description, Status = RiskStatus.Open, Impact = request.Impact, Probability = request.Probability, MitigationPlan = request.MitigationPlan, Owner = request.Owner, IdentifiedDate = DateTime.UtcNow, Notes = request.Notes };
        await _riskRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Project risk {RiskId} '{Title}' created for project {ProjectId}", entity.Id, entity.Title, entity.ProjectId);
        return new ProjectRiskDto { Id = entity.Id, ProjectId = entity.ProjectId, Title = entity.Title, Description = entity.Description, Status = entity.Status, Impact = entity.Impact, Probability = entity.Probability, MitigationPlan = entity.MitigationPlan, Owner = entity.Owner, IdentifiedDate = entity.IdentifiedDate, Notes = entity.Notes, CreatedAt = entity.CreatedAt };
    }
}
