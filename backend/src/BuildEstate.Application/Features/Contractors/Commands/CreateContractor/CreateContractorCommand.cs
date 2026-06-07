using BuildEstate.Application.Features.Contractors.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Contractors.Commands.CreateContractor;
public record CreateContractorCommand : IRequest<ContractorDto>
{
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
