using BuildEstate.Application.Features.Design.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Design.Queries.GetDesignPackagesByProject;

public record GetDesignPackagesByProjectQuery(Guid ProjectId) : IRequest<List<DesignPackageDto>>;
