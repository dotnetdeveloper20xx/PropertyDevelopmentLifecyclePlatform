using BuildEstate.Domain.Common;

namespace BuildEstate.Domain.Entities.Planning;

/// <summary>
/// Represents a document attached to a planning application (plans, drawings, reports).
/// </summary>
public class PlanningDocument : BaseEntity
{
    public Guid PlanningApplicationId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string? Description { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public PlanningApplication PlanningApplication { get; set; } = null!;
}
