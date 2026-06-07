using FluentValidation;

namespace BuildEstate.Application.Features.Planning.Conditions.Commands.DischargeCondition;

/// <summary>
/// Validates DischargeConditionCommand.
/// </summary>
public class DischargeConditionCommandValidator : AbstractValidator<DischargeConditionCommand>
{
    public DischargeConditionCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Condition ID is required.");

        RuleFor(x => x.PlanningApplicationId)
            .NotEmpty().WithMessage("Planning application ID is required.");

        RuleFor(x => x.DischargeReference)
            .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.DischargeReference));
    }
}
