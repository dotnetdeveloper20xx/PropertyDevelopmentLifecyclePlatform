using FluentValidation;
namespace BuildEstate.Application.Features.Projects.Commands.CreateMilestone;
public class CreateMilestoneCommandValidator : AbstractValidator<CreateMilestoneCommand>
{
    public CreateMilestoneCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Milestone title is required.").MaximumLength(300);
        RuleFor(x => x.TargetDate).GreaterThan(DateTime.UtcNow.AddDays(-1)).WithMessage("Target date must be today or in the future.");
    }
}
