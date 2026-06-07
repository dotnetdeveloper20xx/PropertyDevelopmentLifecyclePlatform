using FluentValidation;
namespace BuildEstate.Application.Features.Projects.Commands.ChangeProjectStatus;
public class ChangeProjectStatusCommandValidator : AbstractValidator<ChangeProjectStatusCommand>
{
    public ChangeProjectStatusCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.NewStatus).IsInEnum().WithMessage("New status must be a valid project status.");
    }
}
