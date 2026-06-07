using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Legal;

/// <summary>
/// Represents a legal document (title deed, search report, contract copy, etc.).
/// </summary>
public class LegalDocument : BaseEntity
{
    public Guid? ContractId { get; set; }
    public Guid? OpportunityId { get; set; }
    public string DocumentTitle { get; set; } = string.Empty;
    public LegalDocumentType DocumentType { get; set; }
    public LegalDocumentStatus Status { get; set; } = LegalDocumentStatus.Draft;
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public int Version { get; set; } = 1;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public Contract? Contract { get; set; }
}
