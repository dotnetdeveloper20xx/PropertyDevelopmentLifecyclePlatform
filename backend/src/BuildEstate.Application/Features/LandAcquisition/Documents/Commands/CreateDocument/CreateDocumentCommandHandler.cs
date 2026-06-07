using BuildEstate.Application.Features.LandAcquisition.Documents.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Commands.CreateDocument;

public class CreateDocumentCommandHandler : IRequestHandler<CreateDocumentCommand, DocumentListItemDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<Document> _documentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateDocumentCommandHandler> _logger;

    public CreateDocumentCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<Document> documentRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreateDocumentCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _documentRepository = documentRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<DocumentListItemDto> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        var exists = await _opportunityRepository.ExistsAsync(x => x.Id == request.OpportunityId, cancellationToken);
        if (!exists) throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);

        var entity = new Document
        {
            OpportunityId = request.OpportunityId,
            FileName = request.FileName,
            DocType = request.DocType,
            ContentType = request.ContentType,
            FileSizeBytes = request.FileSizeBytes,
            Description = request.Description,
            FilePath = request.FilePath
        };

        await _documentRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Document {DocumentId} uploaded for opportunity {OpportunityId}", entity.Id, entity.OpportunityId);

        return new DocumentListItemDto
        {
            Id = entity.Id,
            OpportunityId = entity.OpportunityId,
            FileName = entity.FileName,
            DocType = entity.DocType,
            ContentType = entity.ContentType,
            FileSizeBytes = entity.FileSizeBytes,
            Description = entity.Description,
            CreatedAt = entity.CreatedAt,
            CreatedBy = entity.CreatedBy
        };
    }
}
