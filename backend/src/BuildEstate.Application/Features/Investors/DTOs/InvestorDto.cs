using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Investors.DTOs;
public record InvestorDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public InvestorType Type { get; init; }
    public string? ContactName { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public decimal? TotalCommitted { get; init; }
    public decimal? TotalDeployed { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
