using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Planning.Applications.DTOs;

public record PlanningApplicationDetailDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string OpportunityName { get; init; } = string.Empty;
    public string ApplicationReference { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string LocalAuthority { get; init; } = string.Empty;
    public string ApplicationType { get; init; } = string.Empty;
    public PlanningApplicationStatus Status { get; init; }
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
    public int ConditionCount { get; init; }
    public int AppealCount { get; init; }
    public int DocumentCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
    public DateTime? UpdatedAt { get; init; }
}
