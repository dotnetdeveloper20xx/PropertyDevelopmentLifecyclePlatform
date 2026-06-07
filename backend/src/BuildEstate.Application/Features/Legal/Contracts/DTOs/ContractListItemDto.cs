using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Legal.Contracts.DTOs;

public record ContractListItemDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string Title { get; init; } = string.Empty;
    public ContractType ContractType { get; init; }
    public ContractStatus Status { get; init; }
    public string ContractReference { get; init; } = string.Empty;
    public string CounterpartyName { get; init; } = string.Empty;
    public decimal? ContractValue { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime? ExchangeDate { get; init; }
    public DateTime? CompletionDate { get; init; }
    public int DocumentCount { get; init; }
    public int TaskCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
