using BuildEstate.Application.Features.Construction.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Construction.Queries.GetSnagsByStage;
public record GetSnagsByStageQuery(Guid StageId) : IRequest<List<SnagDto>>;
