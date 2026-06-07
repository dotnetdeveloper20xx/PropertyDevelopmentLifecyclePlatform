using BuildEstate.Domain.Enums;
namespace BuildEstate.Application.Features.Projects.DTOs;
public record ProjectRiskDto
{
    public Guid Id { get; init; }
    public Guid ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public RiskStatus Status { get; init; }
    public RiskImpact Impact { get; init; }
    public RiskProbability Probability { get; init; }
    public string? MitigationPlan { get; init; }
    public string? Owner { get; init; }
    public DateTime? IdentifiedDate { get; init; }
    public DateTime? ResolvedDate { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
