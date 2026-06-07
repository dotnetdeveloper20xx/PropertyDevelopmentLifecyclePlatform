using FluentValidation;

namespace BuildEstate.Application.Features.Legal.Tasks.Commands.CreateLegalTask;

public class CreateLegalTaskCommandValidator : AbstractValidator<CreateLegalTaskCommand>
{
    public CreateLegalTaskCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Task title is required.")
            .MaximumLength(500).WithMessage("Title cannot exceed 500 characters.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Priority must be a valid value.");

        RuleFor(x => x.AssignedTo)
            .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.AssignedTo));

        RuleFor(x => x.Description)
            .MaximumLength(2000).When(x => !string.IsNullOrWhiteSpace(x.Description));
    }
}
