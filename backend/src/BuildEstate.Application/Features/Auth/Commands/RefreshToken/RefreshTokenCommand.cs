using BuildEstate.Application.Features.Auth.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Auth.Commands.RefreshToken;

/// <summary>
/// Command to exchange a valid refresh token for a new JWT access token.
/// Implements refresh token rotation — the old token is revoked and replaced.
/// </summary>
public record RefreshTokenCommand : IRequest<AuthResponseDto>
{
    public string RefreshToken { get; init; } = string.Empty;
}
