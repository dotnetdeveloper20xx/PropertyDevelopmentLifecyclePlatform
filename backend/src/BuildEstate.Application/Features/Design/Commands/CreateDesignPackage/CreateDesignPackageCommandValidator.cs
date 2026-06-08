using FluentValidation;

namespace BuildEstate.Application.Features.Design.Commands.CreateDesignPackage;

public class CreateDesignPackageCommandValidator : AbstractValidator<CreateDesignPackageCommand>
{
    public CreateDesignPackageCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Design package title is required.").MaximumLength(300);
    }
}
