using BuildEstate.Application.Features.Documents.DTOs;
using BuildEstate.Domain.Entities.Documents;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Documents.Queries.GetDocuments;

public class GetDocumentsQueryHandler : IRequestHandler<GetDocumentsQuery, ApiResponse<List<KnowledgeDocumentDto>>>
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;
    private readonly IRepository<KnowledgeDocument> _repository;

    public GetDocumentsQueryHandler(IRepository<KnowledgeDocument> repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<List<KnowledgeDocumentDto>>> Handle(GetDocumentsQuery request, CancellationToken cancellationToken)
    {
        var query = _repository.Query().AsNoTracking();

        if (request.Category.HasValue)
            query = query.Where(x => x.Category == request.Category.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(x =>
                x.Title.Contains(search) ||
                (x.Description != null && x.Description.Contains(search)) ||
                x.FileName.Contains(search) ||
                (x.Tags != null && x.Tags.Contains(search)));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var page = request.Page is > 0 ? request.Page.Value : 1;
        var pageSize = request.PageSize switch
        {
            > 0 and <= MaxPageSize => request.PageSize.Value,
            > MaxPageSize => MaxPageSize,
            _ => DefaultPageSize
        };

        var items = await query
            .OrderByDescending(x => x.UploadedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new KnowledgeDocumentDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Title = x.Title,
                Description = x.Description,
                Category = x.Category,
                FileName = x.FileName,
                FilePath = x.FilePath,
                FileSizeBytes = x.FileSizeBytes,
                Version = x.Version,
                Tags = x.Tags,
                UploadedBy = x.UploadedBy,
                UploadedAt = x.UploadedAt,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return ApiResponse<List<KnowledgeDocumentDto>>.Paginated(items, new PaginationMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        });
    }
}
