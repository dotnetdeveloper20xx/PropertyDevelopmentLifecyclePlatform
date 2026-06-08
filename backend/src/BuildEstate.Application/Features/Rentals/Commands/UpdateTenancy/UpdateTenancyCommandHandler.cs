using BuildEstate.Domain.Entities.Rentals;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Rentals.Commands.UpdateTenancy;

/// <summary>
/// Handles updating an existing tenancy.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public class UpdateTenancyCommandHandler : IRequestHandler<UpdateTenancyCommand, Unit>
{
    private readonly IRepository<Tenancy> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateTenancyCommandHandler> _logger;

    public UpdateTenancyCommandHandler(
        IRepository<Tenancy> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateTenancyCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateTenancyCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Tenancy), request.Id);

        entity.TenantName = request.TenantName;
        entity.TenantEmail = request.TenantEmail;
        entity.TenantPhone = request.TenantPhone;
        entity.MonthlyRent = request.MonthlyRent;
        entity.LeaseStartDate = request.LeaseStartDate;
        entity.LeaseEndDate = request.LeaseEndDate;
        entity.Status = request.Status;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Tenancy {TenancyId} updated", entity.Id);

        return Unit.Value;
    }
}
