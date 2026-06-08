namespace BuildEstate.Application.Features.Reports.DTOs;

public record SavedReportDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string ReportType { get; init; } = string.Empty;
    public string? Parameters { get; init; }
    public string? GeneratedBy { get; init; }
    public DateTime? LastGeneratedAt { get; init; }
    public DateTime CreatedAt { get; init; }
}
