using BuildEstate.Application.Features.LandAcquisition.LandOwners.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.LandOwners.Commands.CreateLandOwner;

public class CreateLandOwnerCommandHandler : IRequestHandler<CreateLandOwnerCommand, LandOwnerDto>
{
    private readonly IRepository<LandOwner> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateLandOwnerCommandHandler> _logger;

    public CreateLandOwnerCommandHandler(IRepository<LandOwner> repository, IUnitOfWork unitOfWork, ILogger<CreateLandOwnerCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<LandOwnerDto> Handle(CreateLandOwnerCommand request, CancellationToken cancellationToken)
    {
        var entity = new LandOwner
        {
            Name = request.Name,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Address = request.Address,
            OwnershipType = request.OwnershipType,
            CompanyName = request.CompanyName,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Land owner {LandOwnerId} created: {Name}", entity.Id, entity.Name);

        return new LandOwnerDto
        {
            Id = entity.Id,
            Name = entity.Name,
            ContactEmail = entity.ContactEmail,
            ContactPhone = entity.ContactPhone,
            Address = entity.Address,
            OwnershipType = entity.OwnershipType,
            CompanyName = entity.CompanyName,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
