using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Contractors.Commands.UpdateContractor;

/// <summary>
/// Command to update an existing contractor.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public record UpdateContractorCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string CompanyName { get; init; } = string.Empty;
    public ContractorType Type { get; init; }
    public string? ContactName { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? Trade { get; init; }
    public string? InsuranceDetails { get; init; }
    public DateTime? InsuranceExpiry { get; init; }
    public string? Certifications { get; init; }
    public string? Notes { get; init; }
}
