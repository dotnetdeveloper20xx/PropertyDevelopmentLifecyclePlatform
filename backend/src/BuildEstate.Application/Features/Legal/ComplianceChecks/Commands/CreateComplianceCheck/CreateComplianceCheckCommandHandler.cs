using BuildEstate.Application.Features.Legal.ComplianceChecks.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.CreateComplianceCheck;

public class CreateComplianceCheckCommandHandler : IRequestHandler<CreateComplianceCheckCommand, ComplianceCheckDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<ComplianceCheck> _complianceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateComplianceCheckCommandHandler> _logger;

    public CreateComplianceCheckCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<ComplianceCheck> complianceRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreateComplianceCheckCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _complianceRepository = complianceRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ComplianceCheckDto> Handle(CreateComplianceCheckCommand request, CancellationToken cancellationToken)
    {
        var opportunityExists = await _opportunityRepository.ExistsAsync(
            x => x.Id == request.OpportunityId, cancellationToken);

        if (!opportunityExists)
            throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);

        var entity = new ComplianceCheck
        {
            OpportunityId = request.OpportunityId,
            CheckType = request.CheckType,
            Status = ComplianceCheckStatus.NotStarted,
            AssignedTo = request.AssignedTo,
            DueDate = request.DueDate,
            Notes = request.Notes
        };

        await _complianceRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Compliance check {CheckId} of type {Type} created for opportunity {OpportunityId}",
            entity.Id, entity.CheckType, entity.OpportunityId);

        return new ComplianceCheckDto
        {
            Id = entity.Id,
            OpportunityId = entity.OpportunityId,
            CheckType = entity.CheckType,
            Status = entity.Status,
            AssignedTo = entity.AssignedTo,
            DueDate = entity.DueDate,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
