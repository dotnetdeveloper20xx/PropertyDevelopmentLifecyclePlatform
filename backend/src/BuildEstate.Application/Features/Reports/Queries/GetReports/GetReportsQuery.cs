using BuildEstate.Application.Features.Reports.DTOs;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Reports.Queries.GetReports;

public record GetReportsQuery : IRequest<ApiResponse<List<SavedReportDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
}
