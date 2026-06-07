using BuildEstate.Application.Features.LandAcquisition.Acquisitions.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.Acquisitions.Commands.CreateAcquisitionRecord;

public record CreateAcquisitionRecordCommand : IRequest<AcquisitionRecordDto>
{
    public Guid OpportunityId { get; init; }
    public decimal PurchasePrice { get; init; }
    public string Currency { get; init; } = "GBP";
    public DateTime CompletionDate { get; init; }
    public string? RegistryReference { get; init; }
    public string? SolicitorName { get; init; }
    public string? SolicitorContact { get; init; }
    public string? Notes { get; init; }
}
