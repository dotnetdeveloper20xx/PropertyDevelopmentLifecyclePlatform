using FluentValidation;
namespace BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
public class CreateInvestorCommandValidator : AbstractValidator<CreateInvestorCommand>
{
    public CreateInvestorCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(300);
        RuleFor(x => x.Type).IsInEnum().WithMessage("Investor type must be a valid value.");
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email)).WithMessage("Email must be valid.");
    }
}
