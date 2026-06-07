using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.LandOwners.DTOs;

public record LandOwnerDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? ContactEmail { get; init; }
    public string? ContactPhone { get; init; }
    public string? Address { get; init; }
    public OwnershipType OwnershipType { get; init; }
    public string? CompanyName { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
