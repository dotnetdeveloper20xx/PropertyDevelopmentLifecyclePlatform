using BuildEstate.Application.Features.Projects.DTOs;
using MediatR;
namespace BuildEstate.Application.Features.Projects.Queries.GetProjectById;
public record GetProjectByIdQuery(Guid Id) : IRequest<ProjectDetailDto>;
