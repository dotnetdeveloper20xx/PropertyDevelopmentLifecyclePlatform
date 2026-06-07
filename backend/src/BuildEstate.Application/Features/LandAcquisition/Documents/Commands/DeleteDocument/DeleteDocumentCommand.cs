using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Commands.DeleteDocument;

public record DeleteDocumentCommand(Guid Id, Guid OpportunityId) : IRequest<Unit>;
