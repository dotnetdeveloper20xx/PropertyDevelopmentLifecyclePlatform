using BuildEstate.Application.Features.Defects.DTOs;
using BuildEstate.Domain.Entities.Defects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Defects.Commands.CreateDefect;

public class CreateDefectCommandHandler : IRequestHandler<CreateDefectCommand, DefectDto>
{
    private readonly IRepository<Defect> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateDefectCommandHandler> _logger;

    public CreateDefectCommandHandler(
        IRepository<Defect> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateDefectCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<DefectDto> Handle(CreateDefectCommand request, CancellationToken cancellationToken)
    {
        var entity = new Defect
        {
            PropertyUnitId = request.PropertyUnitId,
            ProjectId = request.ProjectId,
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            Status = DefectStatus.Reported,
            Priority = request.Priority,
            ReportedBy = request.ReportedBy,
            ReportedDate = DateTime.UtcNow,
            UnderWarranty = request.UnderWarranty,
            WarrantyReference = request.WarrantyReference,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Defect {DefectId} '{Title}' reported with priority {Priority}",
            entity.Id, entity.Title, entity.Priority);

        return new DefectDto
        {
            Id = entity.Id,
            PropertyUnitId = entity.PropertyUnitId,
            ProjectId = entity.ProjectId,
            Title = entity.Title,
            Description = entity.Description,
            Location = entity.Location,
            Status = entity.Status,
            Priority = entity.Priority,
            ReportedBy = entity.ReportedBy,
            ReportedDate = entity.ReportedDate,
            AssignedTo = entity.AssignedTo,
            ResolvedDate = entity.ResolvedDate,
            Resolution = entity.Resolution,
            UnderWarranty = entity.UnderWarranty,
            WarrantyReference = entity.WarrantyReference,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
