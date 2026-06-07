using BuildEstate.Application.Features.Investors.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
public record CreateInvestorCommand : IRequest<InvestorDto>
{
    public string Name { get; init; } = string.Empty;
    public InvestorType Type { get; init; }
    public string? ContactName { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Notes { get; init; }
}
