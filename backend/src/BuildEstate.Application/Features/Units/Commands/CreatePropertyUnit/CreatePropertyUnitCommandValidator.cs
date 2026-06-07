using FluentValidation;
namespace BuildEstate.Application.Features.Units.Commands.CreatePropertyUnit;
public class CreatePropertyUnitCommandValidator : AbstractValidator<CreatePropertyUnitCommand>
{
    public CreatePropertyUnitCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.UnitReference).NotEmpty().WithMessage("Unit reference is required.").MaximumLength(100);
        RuleFor(x => x.Price).GreaterThan(0).When(x => x.Price.HasValue).WithMessage("Price must be greater than zero.");
    }
}
