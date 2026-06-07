using BuildEstate.Application.Features.Construction.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Construction.Queries.GetInspectionsByStage;
public record GetInspectionsByStageQuery(Guid StageId) : IRequest<List<InspectionDto>>;
