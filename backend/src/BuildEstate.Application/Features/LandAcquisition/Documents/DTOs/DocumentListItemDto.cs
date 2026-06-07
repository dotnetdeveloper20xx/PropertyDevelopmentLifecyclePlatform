using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.DTOs;

public record DocumentListItemDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string FileName { get; init; } = string.Empty;
    public DocumentType DocType { get; init; }
    public string? ContentType { get; init; }
    public long FileSizeBytes { get; init; }
    public string? Description { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
}
