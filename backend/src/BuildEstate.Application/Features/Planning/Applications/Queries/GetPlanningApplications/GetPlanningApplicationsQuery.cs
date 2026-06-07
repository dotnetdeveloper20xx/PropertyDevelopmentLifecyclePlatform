using BuildEstate.Application.Features.Planning.Applications.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Applications.Queries.GetPlanningApplications;

/// <summary>
/// Query to retrieve a paginated, filterable list of planning applications.
/// </summary>
public record GetPlanningApplicationsQuery : IRequest<ApiResponse<List<PlanningApplicationListItemDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? SortBy { get; init; }
    public string? SortDir { get; init; }
    public string? Search { get; init; }
    public PlanningApplicationStatus? Status { get; init; }
    public Guid? OpportunityId { get; init; }
}
