using BuildEstate.Application.Features.Reports.DTOs;
using BuildEstate.Domain.Entities.Reports;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Reports.Commands.CreateReport;

public class CreateReportCommandHandler : IRequestHandler<CreateReportCommand, SavedReportDto>
{
    private readonly IRepository<SavedReport> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateReportCommandHandler> _logger;

    public CreateReportCommandHandler(
        IRepository<SavedReport> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateReportCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<SavedReportDto> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
        var entity = new SavedReport
        {
            Title = request.Title,
            Description = request.Description,
            ReportType = request.ReportType,
            Parameters = request.Parameters
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Saved report {ReportId} '{Title}' of type {ReportType} created", entity.Id, entity.Title, entity.ReportType);

        return new SavedReportDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Description = entity.Description,
            ReportType = entity.ReportType,
            Parameters = entity.Parameters,
            GeneratedBy = entity.GeneratedBy,
            LastGeneratedAt = entity.LastGeneratedAt,
            CreatedAt = entity.CreatedAt
        };
    }
}
