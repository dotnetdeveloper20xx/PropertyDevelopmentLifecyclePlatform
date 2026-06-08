using BuildEstate.Application.Features.Reports.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Reports.Commands.CreateReport;

public record CreateReportCommand : IRequest<SavedReportDto>
{
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string ReportType { get; init; } = string.Empty;
    public string? Parameters { get; init; }
}
