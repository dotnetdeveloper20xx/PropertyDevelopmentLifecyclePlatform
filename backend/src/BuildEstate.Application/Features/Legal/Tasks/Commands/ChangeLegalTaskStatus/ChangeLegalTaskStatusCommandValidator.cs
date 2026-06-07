using FluentValidation;

namespace BuildEstate.Application.Features.Legal.Tasks.Commands.ChangeLegalTaskStatus;

public class ChangeLegalTaskStatusCommandValidator : AbstractValidator<ChangeLegalTaskStatusCommand>
{
    public ChangeLegalTaskStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Task ID is required.");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("New status must be a valid task status.");
    }
}
