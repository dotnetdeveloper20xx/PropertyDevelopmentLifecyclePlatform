using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.LandAcquisition;

/// <summary>
/// Represents a document attached to a land opportunity.
/// </summary>
public class Document : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public DocumentType DocType { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string? ContentType { get; set; }
    public long FileSizeBytes { get; set; }
    public string? Description { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
}
