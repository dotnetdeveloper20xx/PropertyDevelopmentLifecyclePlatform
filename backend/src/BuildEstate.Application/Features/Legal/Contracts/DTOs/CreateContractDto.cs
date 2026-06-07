namespace BuildEstate.Application.Features.Legal.Contracts.DTOs;

public record CreateContractDto
{
    public Guid Id { get; init; }
    public string ContractReference { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
