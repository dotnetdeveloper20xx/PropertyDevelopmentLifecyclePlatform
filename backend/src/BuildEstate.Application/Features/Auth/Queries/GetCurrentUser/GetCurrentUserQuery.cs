using BuildEstate.Application.Features.Auth.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Auth.Queries.GetCurrentUser;

/// <summary>
/// Query to retrieve the current authenticated user's profile from their token claims.
/// </summary>
public record GetCurrentUserQuery : IRequest<UserInfoDto>;
