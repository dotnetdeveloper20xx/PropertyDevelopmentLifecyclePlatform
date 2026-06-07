using BuildEstate.Application.Features.Legal.Contracts.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Contracts.Commands.CreateContract;

public record CreateContractCommand : IRequest<CreateContractDto>
{
    public Guid OpportunityId { get; init; }
    public string Title { get; init; } = string.Empty;
    public ContractType ContractType { get; init; }
    public string ContractReference { get; init; } = string.Empty;
    public string CounterpartyName { get; init; } = string.Empty;
    public string? CounterpartyContact { get; init; }
    public decimal? ContractValue { get; init; }
    public string? Currency { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public string? Solicitor { get; init; }
    public string? SolicitorFirm { get; init; }
    public string? SolicitorEmail { get; init; }
    public string? KeyTerms { get; init; }
    public string? Notes { get; init; }
}
