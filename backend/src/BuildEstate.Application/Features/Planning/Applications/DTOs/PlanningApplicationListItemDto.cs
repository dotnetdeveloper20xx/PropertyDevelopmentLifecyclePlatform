using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Planning.Applications.DTOs;

public record PlanningApplicationListItemDto
{
    public Guid Id { get; init; }
    public Guid OpportunityId { get; init; }
    public string ApplicationReference { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string LocalAuthority { get; init; } = string.Empty;
    public string ApplicationType { get; init; } = string.Empty;
    public PlanningApplicationStatus Status { get; init; }
    public DateTime? SubmissionDate { get; init; }
    public DateTime? DecisionDate { get; init; }
    public int ConditionCount { get; init; }
    public int AppealCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
