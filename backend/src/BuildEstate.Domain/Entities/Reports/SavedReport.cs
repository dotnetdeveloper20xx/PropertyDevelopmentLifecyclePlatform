using BuildEstate.Domain.Common;

namespace BuildEstate.Domain.Entities.Reports;

public class SavedReport : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ReportType { get; set; } = string.Empty;
    public string? Parameters { get; set; }
    public string? GeneratedBy { get; set; }
    public DateTime? LastGeneratedAt { get; set; }
}
