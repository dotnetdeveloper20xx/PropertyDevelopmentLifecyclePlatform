using BuildEstate.Application.Features.LandAcquisition.Documents.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Queries.GetDocumentsByOpportunity;

public class GetDocumentsByOpportunityQueryHandler
    : IRequestHandler<GetDocumentsByOpportunityQuery, List<DocumentListItemDto>>
{
    private readonly IRepository<Document> _repository;

    public GetDocumentsByOpportunityQueryHandler(IRepository<Document> repository)
    {
        _repository = repository;
    }

    public async Task<List<DocumentListItemDto>> Handle(
        GetDocumentsByOpportunityQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new DocumentListItemDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                FileName = x.FileName,
                DocType = x.DocType,
                ContentType = x.ContentType,
                FileSizeBytes = x.FileSizeBytes,
                Description = x.Description,
                CreatedAt = x.CreatedAt,
                CreatedBy = x.CreatedBy
            })
            .ToListAsync(cancellationToken);
    }
}
