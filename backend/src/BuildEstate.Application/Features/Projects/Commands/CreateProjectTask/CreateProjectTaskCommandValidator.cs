using FluentValidation;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProjectTask;
public class CreateProjectTaskCommandValidator : AbstractValidator<CreateProjectTaskCommand>
{
    public CreateProjectTaskCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Task title is required.").MaximumLength(500);
        RuleFor(x => x.Priority).IsInEnum().WithMessage("Priority must be a valid value.");
        RuleFor(x => x.AssignedTo).MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.AssignedTo));
    }
}
