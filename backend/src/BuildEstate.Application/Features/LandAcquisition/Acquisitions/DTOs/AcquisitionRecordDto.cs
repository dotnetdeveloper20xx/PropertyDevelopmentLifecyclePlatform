using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.LandAcquisition.Acquisitions.DTOs;

public record AcquisitionRecordDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public decimal PurchasePrice { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime CompletionDate { get; init; }
    public string? RegistryReference { get; init; }
    public AcquisitionStatus Status { get; init; }
    public string? SolicitorName { get; init; }
    public string? SolicitorContact { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
