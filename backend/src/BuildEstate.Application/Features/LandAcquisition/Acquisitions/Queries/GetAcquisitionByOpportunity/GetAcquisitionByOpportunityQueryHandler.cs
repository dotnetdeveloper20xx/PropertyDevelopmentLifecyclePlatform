using BuildEstate.Application.Features.LandAcquisition.Acquisitions.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Acquisitions.Queries.GetAcquisitionByOpportunity;

public class GetAcquisitionByOpportunityQueryHandler : IRequestHandler<GetAcquisitionByOpportunityQuery, AcquisitionRecordDto?>
{
    private readonly IRepository<LandAcquisitionRecord> _repository;

    public GetAcquisitionByOpportunityQueryHandler(IRepository<LandAcquisitionRecord> repository)
    {
        _repository = repository;
    }

    public async Task<AcquisitionRecordDto?> Handle(GetAcquisitionByOpportunityQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .Select(x => new AcquisitionRecordDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                PurchasePrice = x.PurchasePrice,
                Currency = x.Currency,
                CompletionDate = x.CompletionDate,
                RegistryReference = x.RegistryReference,
                Status = x.Status,
                SolicitorName = x.SolicitorName,
                SolicitorContact = x.SolicitorContact,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
