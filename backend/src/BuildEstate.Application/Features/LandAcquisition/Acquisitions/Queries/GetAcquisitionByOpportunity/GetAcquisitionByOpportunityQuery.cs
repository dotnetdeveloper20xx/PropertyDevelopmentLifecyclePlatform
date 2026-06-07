using BuildEstate.Application.Features.LandAcquisition.Acquisitions.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Acquisitions.Queries.GetAcquisitionByOpportunity;

public record GetAcquisitionByOpportunityQuery(Guid OpportunityId) : IRequest<AcquisitionRecordDto?>;
