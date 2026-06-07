using FluentValidation;
namespace BuildEstate.Application.Features.Construction.Commands.CreateConstructionStage;
public class CreateConstructionStageCommandValidator : AbstractValidator<CreateConstructionStageCommand>
{
    public CreateConstructionStageCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Stage name is required.").MaximumLength(300);
    }
}
