using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Contractors.DTOs;
public record ContractorDto
{
    public Guid Id { get; init; }
    public string CompanyName { get; init; } = string.Empty;
    public ContractorType Type { get; init; }
    public ContractorStatus Status { get; init; }
    public string? ContactName { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? Trade { get; init; }
    public decimal? Rating { get; init; }
    public string? InsuranceDetails { get; init; }
    public DateTime? InsuranceExpiry { get; init; }
    public string? Certifications { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
