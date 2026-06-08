using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Investors.Commands.UpdateInvestor;

/// <summary>
/// Command to update an existing investor.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public record UpdateInvestorCommand : IRequest<Unit>
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
}
