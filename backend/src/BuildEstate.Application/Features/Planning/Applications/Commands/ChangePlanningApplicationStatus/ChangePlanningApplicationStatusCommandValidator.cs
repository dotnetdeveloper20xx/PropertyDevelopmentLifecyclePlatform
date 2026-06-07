using FluentValidation;

namespace BuildEstate.Application.Features.Planning.Applications.Commands.ChangePlanningApplicationStatus;

/// <summary>
/// Validates ChangePlanningApplicationStatusCommand.
/// </summary>
public class ChangePlanningApplicationStatusCommandValidator
    : AbstractValidator<ChangePlanningApplicationStatusCommand>
{
    public ChangePlanningApplicationStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Planning application ID is required.");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("New status must be a valid planning application status.");
    }
}
