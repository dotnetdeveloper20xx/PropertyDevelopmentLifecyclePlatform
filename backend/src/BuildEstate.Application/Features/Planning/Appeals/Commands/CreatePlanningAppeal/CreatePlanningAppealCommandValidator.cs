using FluentValidation;

namespace BuildEstate.Application.Features.Planning.Appeals.Commands.CreatePlanningAppeal;

/// <summary>
/// Validates CreatePlanningAppealCommand.
/// </summary>
public class CreatePlanningAppealCommandValidator : AbstractValidator<CreatePlanningAppealCommand>
{
    public CreatePlanningAppealCommandValidator()
    {
        RuleFor(x => x.PlanningApplicationId)
            .NotEmpty().WithMessage("Planning application ID is required.");

        RuleFor(x => x.AppealReference)
            .NotEmpty().WithMessage("Appeal reference is required.")
            .MaximumLength(100).WithMessage("Appeal reference cannot exceed 100 characters.");

        RuleFor(x => x.Grounds)
            .NotEmpty().WithMessage("Appeal grounds are required.")
            .MaximumLength(4000).WithMessage("Grounds cannot exceed 4000 characters.");

        RuleFor(x => x.Inspector)
            .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.Inspector));
    }
}
