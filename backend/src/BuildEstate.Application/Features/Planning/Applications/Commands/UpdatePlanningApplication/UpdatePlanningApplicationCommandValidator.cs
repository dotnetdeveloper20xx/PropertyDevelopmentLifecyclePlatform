using FluentValidation;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.UpdatePlanningApplication;

/// <summary>
/// Validates UpdatePlanningApplicationCommand before handler execution.
/// </summary>
public class UpdatePlanningApplicationCommandValidator : AbstractValidator<UpdatePlanningApplicationCommand>
{
    public UpdatePlanningApplicationCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Planning application ID is required.");

        RuleFor(x => x.ApplicationReference)
            .NotEmpty().WithMessage("Application reference is required.")
            .MaximumLength(100).WithMessage("Application reference cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

        RuleFor(x => x.LocalAuthority)
            .NotEmpty().WithMessage("Local authority is required.")
            .MaximumLength(200).WithMessage("Local authority cannot exceed 200 characters.");

        RuleFor(x => x.ApplicationType)
            .NotEmpty().WithMessage("Application type is required.")
            .MaximumLength(100).WithMessage("Application type cannot exceed 100 characters.");

        RuleFor(x => x.ApplicationFee)
            .GreaterThanOrEqualTo(0).When(x => x.ApplicationFee.HasValue)
            .WithMessage("Application fee must be zero or positive.");

        RuleFor(x => x.CaseOfficerEmail)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CaseOfficerEmail))
            .WithMessage("Case officer email must be a valid email address.");
    }
}
