using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Documents.DTOs;

public record KnowledgeDocumentDto
{
    public Guid Id { get; init; }
    public Guid? ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DocumentCategory Category { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string FilePath { get; init; } = string.Empty;
    public long FileSizeBytes { get; init; }
    public int Version { get; init; }
    public string? Tags { get; init; }
    public string? UploadedBy { get; init; }
    public DateTime UploadedAt { get; init; }
    public DateTime CreatedAt { get; init; }
}
