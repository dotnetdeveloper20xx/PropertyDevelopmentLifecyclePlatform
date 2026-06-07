using BuildEstate.Application.Features.LandAcquisition.LandOwners.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.LandOwners.Commands.CreateLandOwner;

public record CreateLandOwnerCommand : IRequest<LandOwnerDto>
{
    public string Name { get; init; } = string.Empty;
    public string? ContactEmail { get; init; }
    public string? ContactPhone { get; init; }
    public string? Address { get; init; }
    public OwnershipType OwnershipType { get; init; } = OwnershipType.Freehold;
    public string? CompanyName { get; init; }
    public string? Notes { get; init; }
}
