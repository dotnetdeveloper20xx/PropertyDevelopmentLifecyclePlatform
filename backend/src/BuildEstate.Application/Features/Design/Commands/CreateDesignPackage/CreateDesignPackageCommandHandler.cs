using BuildEstate.Application.Features.Design.DTOs;
using BuildEstate.Domain.Entities.Design;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Design.Commands.CreateDesignPackage;

public class CreateDesignPackageCommandHandler : IRequestHandler<CreateDesignPackageCommand, DesignPackageDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<DesignPackage> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateDesignPackageCommandHandler> _logger;

    public CreateDesignPackageCommandHandler(
        IRepository<Project> projectRepository,
        IRepository<DesignPackage> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateDesignPackageCommandHandler> logger)
    {
        _projectRepository = projectRepository;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<DesignPackageDto> Handle(CreateDesignPackageCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists)
            throw new NotFoundException(nameof(Project), request.ProjectId);

        var entity = new DesignPackage
        {
            ProjectId = request.ProjectId,
            Title = request.Title,
            Description = request.Description,
            Discipline = request.Discipline,
            Consultant = request.Consultant,
            ConsultantEmail = request.ConsultantEmail,
            Status = DesignStageStatus.Draft,
            Version = 1,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("DesignPackage {PackageId} '{Title}' created for project {ProjectId}",
            entity.Id, entity.Title, entity.ProjectId);

        return new DesignPackageDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            Title = entity.Title,
            Description = entity.Description,
            Discipline = entity.Discipline,
            Status = entity.Status,
            Consultant = entity.Consultant,
            ConsultantEmail = entity.ConsultantEmail,
            Version = entity.Version,
            SubmittedDate = entity.SubmittedDate,
            ApprovedDate = entity.ApprovedDate,
            ApprovedBy = entity.ApprovedBy,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
