using BuildEstate.Application.Features.Defects.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Defects.Queries.GetDefects;

public record GetDefectsQuery : IRequest<ApiResponse<List<DefectDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? SortBy { get; init; }
    public string? SortDir { get; init; }
    public string? Search { get; init; }
    public DefectStatus? Status { get; init; }
    public DefectPriority? Priority { get; init; }
}
