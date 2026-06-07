using BuildEstate.Application.Features.Planning.Appeals.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Appeals.Queries.GetAppealsByApplication;

/// <summary>
/// Query to retrieve all appeals for a planning application.
/// </summary>
public record GetAppealsByApplicationQuery(Guid PlanningApplicationId) : IRequest<List<PlanningAppealDto>>;
