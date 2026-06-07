using BuildEstate.Application.Features.Contractors.DTOs;
using BuildEstate.Domain.Entities.Contractors;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Contractors.Commands.CreateContractor;
public class CreateContractorCommandHandler : IRequestHandler<CreateContractorCommand, ContractorDto>
{
    private readonly IRepository<Contractor> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateContractorCommandHandler> _logger;
    public CreateContractorCommandHandler(IRepository<Contractor> repository, IUnitOfWork unitOfWork, ILogger<CreateContractorCommandHandler> logger)
    { _repository = repository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<ContractorDto> Handle(CreateContractorCommand request, CancellationToken cancellationToken)
    {
        var entity = new Contractor
        {
            CompanyName = request.CompanyName, Type = request.Type, Status = ContractorStatus.Active,
            ContactName = request.ContactName, Email = request.Email, Phone = request.Phone,
            Address = request.Address, Trade = request.Trade, InsuranceDetails = request.InsuranceDetails,
            InsuranceExpiry = request.InsuranceExpiry, Certifications = request.Certifications, Notes = request.Notes
        };
        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Contractor {ContractorId} '{CompanyName}' created", entity.Id, entity.CompanyName);
        return new ContractorDto
        {
            Id = entity.Id, CompanyName = entity.CompanyName, Type = entity.Type, Status = entity.Status,
            ContactName = entity.ContactName, Email = entity.Email, Phone = entity.Phone,
            Address = entity.Address, Trade = entity.Trade, Rating = entity.Rating,
            InsuranceDetails = entity.InsuranceDetails, InsuranceExpiry = entity.InsuranceExpiry,
            Certifications = entity.Certifications, Notes = entity.Notes, CreatedAt = entity.CreatedAt
        };
    }
}
