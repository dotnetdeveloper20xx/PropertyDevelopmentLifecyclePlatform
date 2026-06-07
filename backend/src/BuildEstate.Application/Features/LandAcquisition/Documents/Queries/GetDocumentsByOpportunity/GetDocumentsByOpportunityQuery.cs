using BuildEstate.Application.Features.LandAcquisition.Documents.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Queries.GetDocumentsByOpportunity;

public record GetDocumentsByOpportunityQuery(Guid OpportunityId) : IRequest<List<DocumentListItemDto>>;
