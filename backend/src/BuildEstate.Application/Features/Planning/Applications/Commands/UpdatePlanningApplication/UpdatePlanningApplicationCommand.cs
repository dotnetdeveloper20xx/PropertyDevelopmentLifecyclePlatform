using MediatR;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.UpdatePlanningApplication;

/// <summary>
/// Command to update an existing planning application.
/// </summary>
public record UpdatePlanningApplicationCommand : IRequest
{
    public Guid Id { get; init; }
    public string ApplicationReference { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string LocalAuthority { get; init; } = string.Empty;
    public string ApplicationType { get; init; } = string.Empty;
    public DateTime? SubmissionDate { get; init; }
    public DateTime? ValidationDate { get; init; }
    public DateTime? DecisionDate { get; init; }
    public DateTime? ExpiryDate { get; init; }
    public string? DecisionNotice { get; init; }
    public string? PlanningOfficer { get; init; }
    public string? CaseOfficerEmail { get; init; }
    public string? Ward { get; init; }
    public string? SiteAddress { get; init; }
    public decimal? ApplicationFee { get; init; }
    public string? Notes { get; init; }
}
