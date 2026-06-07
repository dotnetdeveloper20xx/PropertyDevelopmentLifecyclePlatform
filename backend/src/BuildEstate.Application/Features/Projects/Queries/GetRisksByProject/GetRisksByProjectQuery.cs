using BuildEstate.Application.Features.Projects.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Queries.GetRisksByProject;
public record GetRisksByProjectQuery(Guid ProjectId) : IRequest<List<ProjectRiskDto>>;
