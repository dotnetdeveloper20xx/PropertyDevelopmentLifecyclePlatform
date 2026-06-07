using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Queries.GetProjects;
public record GetProjectsQuery : IRequest<ApiResponse<List<ProjectListItemDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? SortBy { get; init; }
    public string? SortDir { get; init; }
    public string? Search { get; init; }
    public ProjectStatus? Status { get; init; }
}
