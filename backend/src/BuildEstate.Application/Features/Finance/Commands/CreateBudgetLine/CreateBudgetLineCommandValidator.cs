using FluentValidation;
namespace BuildEstate.Application.Features.Finance.Commands.CreateBudgetLine;
public class CreateBudgetLineCommandValidator : AbstractValidator<CreateBudgetLineCommand>
{
    public CreateBudgetLineCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Category).NotEmpty().WithMessage("Category is required.").MaximumLength(200);
        RuleFor(x => x.PlannedAmount).GreaterThan(0).WithMessage("Planned amount must be greater than zero.");
    }
}
