using BuildEstate.Application.Features.Units.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Units.Queries.GetUnitsByProject;
public record GetUnitsByProjectQuery(Guid ProjectId) : IRequest<List<PropertyUnitDto>>;
