using BuildEstate.Application.Features.Auth.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Auth.Commands.Login;

/// <summary>
/// Command to authenticate a user with email and password.
/// Returns JWT access token + refresh token on success.
/// </summary>
public record LoginCommand : IRequest<AuthResponseDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
