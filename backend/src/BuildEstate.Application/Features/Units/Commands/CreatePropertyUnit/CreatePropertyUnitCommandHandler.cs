using BuildEstate.Application.Features.Units.DTOs;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Units.Commands.CreatePropertyUnit;
public class CreatePropertyUnitCommandHandler : IRequestHandler<CreatePropertyUnitCommand, PropertyUnitDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<PropertyUnit> _unitRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePropertyUnitCommandHandler> _logger;
    public CreatePropertyUnitCommandHandler(IRepository<Project> projectRepository, IRepository<PropertyUnit> unitRepository, IUnitOfWork unitOfWork, ILogger<CreatePropertyUnitCommandHandler> logger)
    { _projectRepository = projectRepository; _unitRepository = unitRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<PropertyUnitDto> Handle(CreatePropertyUnitCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var entity = new PropertyUnit
        {
            ProjectId = request.ProjectId,
            UnitReference = request.UnitReference,
            UnitType = request.UnitType,
            Bedrooms = request.Bedrooms,
            FloorArea = request.FloorArea,
            Price = request.Price,
            Status = UnitStatus.NotReleased,
            Floor = request.Floor,
            Notes = request.Notes
        };
        await _unitRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("PropertyUnit {UnitId} '{UnitReference}' created for project {ProjectId}", entity.Id, entity.UnitReference, entity.ProjectId);
        return new PropertyUnitDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            UnitReference = entity.UnitReference,
            UnitType = entity.UnitType,
            Bedrooms = entity.Bedrooms,
            FloorArea = entity.FloorArea,
            Price = entity.Price,
            Status = entity.Status,
            Floor = entity.Floor,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
