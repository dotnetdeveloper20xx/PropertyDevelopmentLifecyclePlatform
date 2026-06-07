using BuildEstate.Application.Features.Planning.Applications.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.CreatePlanningApplication;

/// <summary>
/// Command to create a new planning application linked to a land opportunity.
/// </summary>
public record CreatePlanningApplicationCommand : IRequest<CreatePlanningApplicationDto>
{
    public Guid OpportunityId { get; init; }
    public string ApplicationReference { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string LocalAuthority { get; init; } = string.Empty;
    public string ApplicationType { get; init; } = string.Empty;
    public DateTime? SubmissionDate { get; init; }
    public string? PlanningOfficer { get; init; }
    public string? CaseOfficerEmail { get; init; }
    public string? Ward { get; init; }
    public string? SiteAddress { get; init; }
    public decimal? ApplicationFee { get; init; }
    public string? Notes { get; init; }
}
