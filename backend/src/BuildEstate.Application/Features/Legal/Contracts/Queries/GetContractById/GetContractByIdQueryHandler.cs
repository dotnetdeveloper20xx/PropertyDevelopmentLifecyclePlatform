using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Legal.Contracts.Queries.GetContractById;

public class GetContractByIdQueryHandler : IRequestHandler<GetContractByIdQuery, ContractDetailDto>
{
    private readonly IRepository<Contract> _repository;

    public GetContractByIdQueryHandler(IRepository<Contract> repository)
    {
        _repository = repository;
    }

    public async Task<ContractDetailDto> Handle(GetContractByIdQuery request, CancellationToken cancellationToken)
    {
        var dto = await _repository.Query()
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new ContractDetailDto
            {
                Id = x.Id,
                OpportunityId = x.OpportunityId,
                OpportunityName = x.Opportunity.Name,
                Title = x.Title,
                ContractType = x.ContractType,
                Status = x.Status,
                ContractReference = x.ContractReference,
                CounterpartyName = x.CounterpartyName,
                CounterpartyContact = x.CounterpartyContact,
                ContractValue = x.ContractValue,
                Currency = x.Currency,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                ExchangeDate = x.ExchangeDate,
                CompletionDate = x.CompletionDate,
                Solicitor = x.Solicitor,
                SolicitorFirm = x.SolicitorFirm,
                SolicitorEmail = x.SolicitorEmail,
                KeyTerms = x.KeyTerms,
                Notes = x.Notes,
                DocumentCount = x.Documents.Count(d => !d.IsDeleted),
                TaskCount = x.Tasks.Count(t => !t.IsDeleted),
                CreatedAt = x.CreatedAt,
                CreatedBy = x.CreatedBy,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException(nameof(Contract), request.Id);

        return dto;
    }
}
