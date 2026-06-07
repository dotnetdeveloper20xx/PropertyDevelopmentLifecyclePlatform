using FluentValidation;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProject;
public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.OpportunityId).NotEmpty().WithMessage("Opportunity ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Project name is required.").MaximumLength(300);
        RuleFor(x => x.ProjectReference).NotEmpty().WithMessage("Project reference is required.").MaximumLength(100);
        RuleFor(x => x.Budget).GreaterThan(0).When(x => x.Budget.HasValue).WithMessage("Budget must be positive.");
        RuleFor(x => x.TotalUnits).GreaterThan(0).When(x => x.TotalUnits.HasValue).WithMessage("Total units must be positive.");
        RuleFor(x => x.ProjectManager).MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.ProjectManager));
    }
}
