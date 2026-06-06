using BuildEstate.Application.Features.LandAcquisition.DueDiligences.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.CreateDueDiligence;

/// <summary>
/// Handles creation of a due diligence check.
/// Validates that the parent opportunity exists before creating.
/// </summary>
public class CreateDueDiligenceCommandHandler : IRequestHandler<CreateDueDiligenceCommand, DueDiligenceListItemDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<DueDiligence> _dueDiligenceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateDueDiligenceCommandHandler> _logger;

    public CreateDueDiligenceCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<DueDiligence> dueDiligenceRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreateDueDiligenceCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _dueDiligenceRepository = dueDiligenceRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<DueDiligenceListItemDto> Handle(
        CreateDueDiligenceCommand request,
        CancellationToken cancellationToken)
    {
        // Validate parent opportunity exists
        var opportunityExists = await _opportunityRepository.ExistsAsync(
            x => x.Id == request.OpportunityId, cancellationToken);

        if (!opportunityExists)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);
        }

        var entity = new DueDiligence
        {
            OpportunityId = request.OpportunityId,
            Type = request.Type,
            Status = DueDiligenceStatus.Pending,
            AssignedTo = request.AssignedTo,
            Notes = request.Notes
        };

        await _dueDiligenceRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Due diligence {DueDiligenceId} of type {Type} created for opportunity {OpportunityId}",
            entity.Id, entity.Type, entity.OpportunityId);

        return new DueDiligenceListItemDto
        {
            Id = entity.Id,
            OpportunityId = entity.OpportunityId,
            Type = entity.Type,
            Status = entity.Status,
            AssignedTo = entity.AssignedTo,
            RiskLevel = entity.RiskLevel,
            ReportDate = entity.ReportDate,
            CreatedAt = entity.CreatedAt
        };
    }
}
