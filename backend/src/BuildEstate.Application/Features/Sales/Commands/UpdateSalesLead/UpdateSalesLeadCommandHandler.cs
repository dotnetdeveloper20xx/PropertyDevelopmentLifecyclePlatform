using BuildEstate.Domain.Entities.Sales;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Sales.Commands.UpdateSalesLead;

/// <summary>
/// Handles updating an existing sales lead.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public class UpdateSalesLeadCommandHandler : IRequestHandler<UpdateSalesLeadCommand, Unit>
{
    private readonly IRepository<SalesLead> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateSalesLeadCommandHandler> _logger;

    public UpdateSalesLeadCommandHandler(
        IRepository<SalesLead> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateSalesLeadCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateSalesLeadCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(SalesLead), request.Id);

        entity.Name = request.Name;
        entity.Email = request.Email;
        entity.Phone = request.Phone;
        entity.Source = request.Source;
        entity.Status = request.Status;
        entity.InterestDetails = request.InterestDetails;
        entity.Budget = request.Budget;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("SalesLead {SalesLeadId} updated", entity.Id);

        return Unit.Value;
    }
}
