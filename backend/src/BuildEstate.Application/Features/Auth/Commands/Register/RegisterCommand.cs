using BuildEstate.Application.Features.Auth.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Auth.Commands.Register;

/// <summary>
/// Command to register a new user account.
/// Creates the user, assigns the specified role, and returns auth tokens.
/// </summary>
public record RegisterCommand : IRequest<AuthResponseDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? Role { get; init; }
}
