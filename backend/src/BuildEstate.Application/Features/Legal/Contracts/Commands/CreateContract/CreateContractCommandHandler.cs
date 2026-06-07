using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Legal.Contracts.Commands.CreateContract;

public class CreateContractCommandHandler : IRequestHandler<CreateContractCommand, CreateContractDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<Contract> _contractRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateContractCommandHandler> _logger;

    public CreateContractCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<Contract> contractRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreateContractCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _contractRepository = contractRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<CreateContractDto> Handle(CreateContractCommand request, CancellationToken cancellationToken)
    {
        var opportunityExists = await _opportunityRepository.ExistsAsync(
            x => x.Id == request.OpportunityId, cancellationToken);

        if (!opportunityExists)
            throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);

        var entity = new Contract
        {
            OpportunityId = request.OpportunityId,
            Title = request.Title,
            ContractType = request.ContractType,
            Status = ContractStatus.Draft,
            ContractReference = request.ContractReference,
            CounterpartyName = request.CounterpartyName,
            CounterpartyContact = request.CounterpartyContact,
            ContractValue = request.ContractValue,
            Currency = request.Currency ?? "GBP",
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Solicitor = request.Solicitor,
            SolicitorFirm = request.SolicitorFirm,
            SolicitorEmail = request.SolicitorEmail,
            KeyTerms = request.KeyTerms,
            Notes = request.Notes
        };

        await _contractRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Contract {ContractId} '{Reference}' created for opportunity {OpportunityId}",
            entity.Id, entity.ContractReference, entity.OpportunityId);

        return new CreateContractDto
        {
            Id = entity.Id,
            ContractReference = entity.ContractReference,
            Status = entity.Status.ToString(),
            CreatedAt = entity.CreatedAt
        };
    }
}
