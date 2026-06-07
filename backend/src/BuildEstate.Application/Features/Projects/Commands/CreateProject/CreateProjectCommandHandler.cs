using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProject;
public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, CreateProjectDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<Project> _projectRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateProjectCommandHandler> _logger;
    public CreateProjectCommandHandler(IRepository<LandOpportunity> opportunityRepository, IRepository<Project> projectRepository, IUnitOfWork unitOfWork, ILogger<CreateProjectCommandHandler> logger)
    { _opportunityRepository = opportunityRepository; _projectRepository = projectRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<CreateProjectDto> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var opportunityExists = await _opportunityRepository.ExistsAsync(x => x.Id == request.OpportunityId, cancellationToken);
        if (!opportunityExists) throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);
        var entity = new Project
        {
            OpportunityId = request.OpportunityId, Name = request.Name, Description = request.Description,
            ProjectReference = request.ProjectReference, Status = ProjectStatus.Planning,
            ProjectManager = request.ProjectManager, SiteAddress = request.SiteAddress,
            StartDate = request.StartDate, TargetEndDate = request.TargetEndDate,
            Budget = request.Budget, TotalUnits = request.TotalUnits, Notes = request.Notes
        };
        await _projectRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Project {ProjectId} '{Reference}' created for opportunity {OpportunityId}", entity.Id, entity.ProjectReference, entity.OpportunityId);
        return new CreateProjectDto { Id = entity.Id, ProjectReference = entity.ProjectReference, Status = entity.Status.ToString(), CreatedAt = entity.CreatedAt };
    }
}
