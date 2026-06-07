using BuildEstate.Application.Features.Planning.Applications.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Applications.Queries.GetPlanningApplicationById;

/// <summary>
/// Query to retrieve a single planning application by ID with full detail.
/// </summary>
public record GetPlanningApplicationByIdQuery(Guid Id) : IRequest<PlanningApplicationDetailDto>;
