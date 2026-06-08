using BuildEstate.Application.Features.Documents.DTOs;
using BuildEstate.Domain.Entities.Documents;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Documents.Commands.CreateDocument;

public class CreateDocumentCommandHandler : IRequestHandler<CreateDocumentCommand, KnowledgeDocumentDto>
{
    private readonly IRepository<KnowledgeDocument> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateDocumentCommandHandler> _logger;

    public CreateDocumentCommandHandler(
        IRepository<KnowledgeDocument> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateDocumentCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<KnowledgeDocumentDto> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = new KnowledgeDocument
        {
            ProjectId = request.ProjectId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            FileName = request.FileName,
            FilePath = request.FilePath,
            FileSizeBytes = request.FileSizeBytes,
            Tags = request.Tags,
            UploadedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Document {DocumentId} '{Title}' uploaded successfully", entity.Id, entity.Title);

        return new KnowledgeDocumentDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            Title = entity.Title,
            Description = entity.Description,
            Category = entity.Category,
            FileName = entity.FileName,
            FilePath = entity.FilePath,
            FileSizeBytes = entity.FileSizeBytes,
            Version = entity.Version,
            Tags = entity.Tags,
            UploadedBy = entity.UploadedBy,
            UploadedAt = entity.UploadedAt,
            CreatedAt = entity.CreatedAt
        };
    }
}
