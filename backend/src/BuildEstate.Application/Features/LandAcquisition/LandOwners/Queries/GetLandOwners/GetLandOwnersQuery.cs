using BuildEstate.Application.Features.LandAcquisition.LandOwners.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.LandAcquisition.LandOwners.Queries.GetLandOwners;

public record GetLandOwnersQuery : IRequest<List<LandOwnerDto>>;
