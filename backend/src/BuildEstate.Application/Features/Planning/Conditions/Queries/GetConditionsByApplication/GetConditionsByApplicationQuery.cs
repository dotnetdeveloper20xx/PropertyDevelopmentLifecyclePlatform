using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Conditions.Queries.GetConditionsByApplication;

/// <summary>
/// Query to retrieve all conditions for a planning application.
/// </summary>
public record GetConditionsByApplicationQuery(Guid PlanningApplicationId) : IRequest<List<PlanningConditionDto>>;
