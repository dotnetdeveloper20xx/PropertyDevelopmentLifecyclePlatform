using BuildEstate.Application.Features.LandAcquisition.Documents.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Commands.CreateDocument;

/// <summary>
/// Command to create/upload a document record for an opportunity.
/// File storage is handled separately — this records metadata.
/// </summary>
public record CreateDocumentCommand : IRequest<DocumentListItemDto>
{
    public Guid OpportunityId { get; init; }
    public string FileName { get; init; } = string.Empty;
    public DocumentType DocType { get; init; }
    public string? ContentType { get; init; }
    public long FileSizeBytes { get; init; }
    public string? Description { get; init; }
    public string FilePath { get; init; } = string.Empty;
}
