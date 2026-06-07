using BuildEstate.Application.Features.Units.DTOs;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
namespace BuildEstate.Application.Features.Units.Queries.GetUnitsByProject;
public class GetUnitsByProjectQueryHandler : IRequestHandler<GetUnitsByProjectQuery, List<PropertyUnitDto>>
{
    private readonly IRepository<PropertyUnit> _repository;
    public GetUnitsByProjectQueryHandler(IRepository<PropertyUnit> repository) { _repository = repository; }
    public async Task<List<PropertyUnitDto>> Handle(GetUnitsByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query().AsNoTracking().Where(x => x.ProjectId == request.ProjectId).OrderBy(x => x.UnitReference)
            .Select(x => new PropertyUnitDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                UnitReference = x.UnitReference,
                UnitType = x.UnitType,
                Bedrooms = x.Bedrooms,
                FloorArea = x.FloorArea,
                Price = x.Price,
                Status = x.Status,
                Floor = x.Floor,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            }).ToListAsync(cancellationToken);
    }
}
