using BuildEstate.Application.Features.Documents.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Documents.Commands.CreateDocument;

public record CreateDocumentCommand : IRequest<KnowledgeDocumentDto>
{
    public Guid? ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DocumentCategory Category { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string FilePath { get; init; } = string.Empty;
    public long FileSizeBytes { get; init; }
    public string? Tags { get; init; }
    public string? Notes { get; init; }
}
