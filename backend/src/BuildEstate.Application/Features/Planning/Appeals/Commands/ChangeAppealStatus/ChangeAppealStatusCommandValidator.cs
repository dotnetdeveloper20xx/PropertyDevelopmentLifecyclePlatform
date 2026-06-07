using FluentValidation;

namespace BuildEstate.Application.Features.Planning.Appeals.Commands.ChangeAppealStatus;

/// <summary>
/// Validates ChangeAppealStatusCommand.
/// </summary>
public class ChangeAppealStatusCommandValidator : AbstractValidator<ChangeAppealStatusCommand>
{
    public ChangeAppealStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Appeal ID is required.");

        RuleFor(x => x.PlanningApplicationId)
            .NotEmpty().WithMessage("Planning application ID is required.");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("New status must be a valid appeal status.");
    }
}
