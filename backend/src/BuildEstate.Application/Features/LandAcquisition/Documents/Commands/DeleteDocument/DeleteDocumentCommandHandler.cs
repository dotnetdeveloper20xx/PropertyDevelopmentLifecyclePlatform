using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Commands.DeleteDocument;

public class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand, Unit>
{
    private readonly IRepository<Document> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteDocumentCommandHandler(IRepository<Document> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (entity is null || entity.OpportunityId != request.OpportunityId)
            throw new NotFoundException(nameof(Document), request.Id);

        await _repository.DeleteAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
