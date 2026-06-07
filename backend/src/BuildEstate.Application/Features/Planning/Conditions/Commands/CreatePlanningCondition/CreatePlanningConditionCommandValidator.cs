using FluentValidation;

namespace BuildEstate.Application.Features.Planning.Conditions.Commands.CreatePlanningCondition;

/// <summary>
/// Validates CreatePlanningConditionCommand.
/// </summary>
public class CreatePlanningConditionCommandValidator : AbstractValidator<CreatePlanningConditionCommand>
{
    public CreatePlanningConditionCommandValidator()
    {
        RuleFor(x => x.PlanningApplicationId)
            .NotEmpty().WithMessage("Planning application ID is required.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Condition title is required.")
            .MaximumLength(500).WithMessage("Condition title cannot exceed 500 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Condition description is required.")
            .MaximumLength(2000).WithMessage("Condition description cannot exceed 2000 characters.");

        RuleFor(x => x.AssignedTo)
            .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.AssignedTo));
    }
}
