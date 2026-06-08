using BuildEstate.Domain.Enums;
using FluentValidation;

namespace BuildEstate.Application.Features.Investors.Commands.UpdateInvestor;

/// <summary>
/// Validates UpdateInvestorCommand before handler execution.
/// Full PUT — required fields must always be present.
/// </summary>
public class UpdateInvestorCommandValidator : AbstractValidator<UpdateInvestorCommand>
{
    public UpdateInvestorCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Investor ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Investor name is required.")
            .MaximumLength(300).WithMessage("Investor name cannot exceed 300 characters.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid investor type.");
    }
}
