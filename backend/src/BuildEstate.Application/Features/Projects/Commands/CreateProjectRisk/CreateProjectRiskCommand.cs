using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProjectRisk;
public record CreateProjectRiskCommand : IRequest<ProjectRiskDto>
{
    public Guid ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public RiskImpact Impact { get; init; } = RiskImpact.Medium;
    public RiskProbability Probability { get; init; } = RiskProbability.Medium;
    public string? MitigationPlan { get; init; }
    public string? Owner { get; init; }
    public string? Notes { get; init; }
}
