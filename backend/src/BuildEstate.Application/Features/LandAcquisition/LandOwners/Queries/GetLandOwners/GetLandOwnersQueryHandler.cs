using BuildEstate.Application.Features.LandAcquisition.LandOwners.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.LandOwners.Queries.GetLandOwners;

public class GetLandOwnersQueryHandler : IRequestHandler<GetLandOwnersQuery, List<LandOwnerDto>>
{
    private readonly IRepository<LandOwner> _repository;

    public GetLandOwnersQueryHandler(IRepository<LandOwner> repository)
    {
        _repository = repository;
    }

    public async Task<List<LandOwnerDto>> Handle(GetLandOwnersQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .Select(x => new LandOwnerDto
            {
                Id = x.Id,
                Name = x.Name,
                ContactEmail = x.ContactEmail,
                ContactPhone = x.ContactPhone,
                Address = x.Address,
                OwnershipType = x.OwnershipType,
                CompanyName = x.CompanyName,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
