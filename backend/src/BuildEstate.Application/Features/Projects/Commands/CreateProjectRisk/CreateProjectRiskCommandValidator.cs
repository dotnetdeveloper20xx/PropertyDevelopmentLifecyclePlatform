using FluentValidation;
namespace BuildEstate.Application.Features.Projects.Commands.CreateProjectRisk;
public class CreateProjectRiskCommandValidator : AbstractValidator<CreateProjectRiskCommand>
{
    public CreateProjectRiskCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Risk title is required.").MaximumLength(500);
        RuleFor(x => x.Impact).IsInEnum().WithMessage("Impact must be a valid value.");
        RuleFor(x => x.Probability).IsInEnum().WithMessage("Probability must be a valid value.");
        RuleFor(x => x.Owner).MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.Owner));
    }
}
