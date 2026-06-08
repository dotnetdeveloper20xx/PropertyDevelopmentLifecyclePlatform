using BuildEstate.Domain.Entities.Contractors;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Contractors.Commands.UpdateContractor;

/// <summary>
/// Handles updating an existing contractor.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public class UpdateContractorCommandHandler : IRequestHandler<UpdateContractorCommand, Unit>
{
    private readonly IRepository<Contractor> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateContractorCommandHandler> _logger;

    public UpdateContractorCommandHandler(
        IRepository<Contractor> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateContractorCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateContractorCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Contractor), request.Id);

        entity.CompanyName = request.CompanyName;
        entity.Type = request.Type;
        entity.ContactName = request.ContactName;
        entity.Email = request.Email;
        entity.Phone = request.Phone;
        entity.Address = request.Address;
        entity.Trade = request.Trade;
        entity.InsuranceDetails = request.InsuranceDetails;
        entity.InsuranceExpiry = request.InsuranceExpiry;
        entity.Certifications = request.Certifications;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Contractor {ContractorId} updated", entity.Id);

        return Unit.Value;
    }
}
