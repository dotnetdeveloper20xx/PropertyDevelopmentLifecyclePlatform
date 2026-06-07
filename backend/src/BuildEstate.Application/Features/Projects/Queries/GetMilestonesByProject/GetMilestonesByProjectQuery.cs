using BuildEstate.Application.Features.Projects.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Queries.GetMilestonesByProject;
public record GetMilestonesByProjectQuery(Guid ProjectId) : IRequest<List<MilestoneDto>>;
