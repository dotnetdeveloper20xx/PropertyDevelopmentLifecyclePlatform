using BuildEstate.Domain.Enums;
using FluentValidation;

namespace BuildEstate.Application.Features.Contractors.Commands.UpdateContractor;

/// <summary>
/// Validates UpdateContractorCommand before handler execution.
/// Full PUT — required fields must always be present.
/// </summary>
public class UpdateContractorCommandValidator : AbstractValidator<UpdateContractorCommand>
{
    public UpdateContractorCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Contractor ID is required.");

        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required.")
            .MaximumLength(300).WithMessage("Company name cannot exceed 300 characters.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid contractor type.");

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email))
            .WithMessage("A valid email address is required.");
    }
}
