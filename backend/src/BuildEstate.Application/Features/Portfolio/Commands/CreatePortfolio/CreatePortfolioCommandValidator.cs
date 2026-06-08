using FluentValidation;

namespace BuildEstate.Application.Features.Portfolio.Commands.CreatePortfolio;

public class CreatePortfolioCommandValidator : AbstractValidator<CreatePortfolioCommand>
{
    public CreatePortfolioCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Portfolio name is required.").MaximumLength(300);
        RuleFor(x => x.TargetInvestment).GreaterThan(0).WithMessage("Target investment must be greater than zero.");
    }
}
