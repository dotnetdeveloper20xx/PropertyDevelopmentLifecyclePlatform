using BuildEstate.Application.Features.Projects.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Queries.GetTasksByProject;
public record GetTasksByProjectQuery(Guid ProjectId) : IRequest<List<ProjectTaskDto>>;
