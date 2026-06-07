using BuildEstate.Application.Features.Construction.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Construction.Queries.GetStagesByProject;
public record GetStagesByProjectQuery(Guid ProjectId) : IRequest<List<ConstructionStageDto>>;
