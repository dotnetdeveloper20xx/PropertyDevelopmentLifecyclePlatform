using BuildEstate.Application.Features.LandAcquisition.Acquisitions.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Acquisitions.Commands.CreateAcquisitionRecord;

public class CreateAcquisitionRecordCommandHandler : IRequestHandler<CreateAcquisitionRecordCommand, AcquisitionRecordDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepo;
    private readonly IRepository<LandAcquisitionRecord> _acquisitionRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateAcquisitionRecordCommandHandler> _logger;

    public CreateAcquisitionRecordCommandHandler(
        IRepository<LandOpportunity> opportunityRepo,
        IRepository<LandAcquisitionRecord> acquisitionRepo,
        IUnitOfWork unitOfWork,
        ILogger<CreateAcquisitionRecordCommandHandler> logger)
    {
        _opportunityRepo = opportunityRepo;
        _acquisitionRepo = acquisitionRepo;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<AcquisitionRecordDto> Handle(CreateAcquisitionRecordCommand request, CancellationToken cancellationToken)
    {
        var opportunity = await _opportunityRepo.GetByIdAsync(request.OpportunityId, cancellationToken)
            ?? throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);

        // Check if acquisition record already exists
        var existing = await _acquisitionRepo.ExistsAsync(x => x.OpportunityId == request.OpportunityId, cancellationToken);
        if (existing) throw new BadRequestException("An acquisition record already exists for this opportunity.");

        var entity = new LandAcquisitionRecord
        {
            OpportunityId = request.OpportunityId,
            PurchasePrice = request.PurchasePrice,
            Currency = request.Currency,
            CompletionDate = request.CompletionDate,
            RegistryReference = request.RegistryReference,
            SolicitorName = request.SolicitorName,
            SolicitorContact = request.SolicitorContact,
            Notes = request.Notes,
            Status = AcquisitionStatus.InProgress
        };

        await _acquisitionRepo.AddAsync(entity, cancellationToken);

        // Progress opportunity to Acquired status
        opportunity.Status = OpportunityStatus.Acquired;
        await _opportunityRepo.UpdateAsync(opportunity, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Acquisition record {AcquisitionId} created for opportunity {OpportunityId}", entity.Id, entity.OpportunityId);

        return new AcquisitionRecordDto
        {
            Id = entity.Id,
            OpportunityId = entity.OpportunityId,
            PurchasePrice = entity.PurchasePrice,
            Currency = entity.Currency,
            CompletionDate = entity.CompletionDate,
            RegistryReference = entity.RegistryReference,
            Status = entity.Status,
            SolicitorName = entity.SolicitorName,
            SolicitorContact = entity.SolicitorContact,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
