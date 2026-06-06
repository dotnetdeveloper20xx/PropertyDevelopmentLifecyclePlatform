using FluentValidation;

namespace BuildEstate.Application.Features.Auth.Commands.RefreshToken;

/// <summary>
/// Validates refresh token command.
/// </summary>
public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }
}
