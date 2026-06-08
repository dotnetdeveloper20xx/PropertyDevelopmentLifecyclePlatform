using BuildEstate.Application.Features.Documents.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Documents.Queries.GetDocuments;

public record GetDocumentsQuery : IRequest<ApiResponse<List<KnowledgeDocumentDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public string? Search { get; init; }
    public DocumentCategory? Category { get; init; }
}
