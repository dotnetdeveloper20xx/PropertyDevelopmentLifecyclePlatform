using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Legal.Contracts.DTOs;

public record ContractDetailDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string OpportunityName { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public ContractType ContractType { get; init; }
    public ContractStatus Status { get; init; }
    public string ContractReference { get; init; } = string.Empty;
    public string CounterpartyName { get; init; } = string.Empty;
    public string? CounterpartyContact { get; init; }
    public decimal? ContractValue { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public DateTime? ExchangeDate { get; init; }
    public DateTime? CompletionDate { get; init; }
    public string? Solicitor { get; init; }
    public string? SolicitorFirm { get; init; }
    public string? SolicitorEmail { get; init; }
    public string? KeyTerms { get; init; }
    public string? Notes { get; init; }
    public int DocumentCount { get; init; }
    public int TaskCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
    public DateTime? UpdatedAt { get; init; }
}
