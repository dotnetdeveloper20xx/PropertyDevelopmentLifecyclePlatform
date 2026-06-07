using BuildEstate.Application.Features.Rentals.DTOs;
using BuildEstate.Domain.Entities.Rentals;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Rentals.Commands.CreateTenancy;
public class CreateTenancyCommandHandler : IRequestHandler<CreateTenancyCommand, TenancyDto>
{
    private readonly IRepository<PropertyUnit> _unitRepository;
    private readonly IRepository<Tenancy> _tenancyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateTenancyCommandHandler> _logger;
    public CreateTenancyCommandHandler(IRepository<PropertyUnit> unitRepository, IRepository<Tenancy> tenancyRepository, IUnitOfWork unitOfWork, ILogger<CreateTenancyCommandHandler> logger)
    { _unitRepository = unitRepository; _tenancyRepository = tenancyRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<TenancyDto> Handle(CreateTenancyCommand request, CancellationToken cancellationToken)
    {
        var unitExists = await _unitRepository.ExistsAsync(x => x.Id == request.PropertyUnitId, cancellationToken);
        if (!unitExists) throw new NotFoundException(nameof(PropertyUnit), request.PropertyUnitId);
        var entity = new Tenancy
        {
            PropertyUnitId = request.PropertyUnitId,
            TenantName = request.TenantName,
            TenantEmail = request.TenantEmail,
            TenantPhone = request.TenantPhone,
            MonthlyRent = request.MonthlyRent,
            LeaseStartDate = request.LeaseStartDate,
            LeaseEndDate = request.LeaseEndDate,
            Status = TenancyStatus.Active,
            Notes = request.Notes
        };
        await _tenancyRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Tenancy {TenancyId} created for unit {PropertyUnitId}", entity.Id, entity.PropertyUnitId);
        return new TenancyDto
        {
            Id = entity.Id,
            PropertyUnitId = entity.PropertyUnitId,
            TenantName = entity.TenantName,
            TenantEmail = entity.TenantEmail,
            TenantPhone = entity.TenantPhone,
            MonthlyRent = entity.MonthlyRent,
            LeaseStartDate = entity.LeaseStartDate,
            LeaseEndDate = entity.LeaseEndDate,
            Status = entity.Status,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
