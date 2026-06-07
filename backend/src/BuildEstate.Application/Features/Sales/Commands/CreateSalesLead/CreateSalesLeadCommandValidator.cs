using FluentValidation;
namespace BuildEstate.Application.Features.Sales.Commands.CreateSalesLead;
public class CreateSalesLeadCommandValidator : AbstractValidator<CreateSalesLeadCommand>
{
    public CreateSalesLeadCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(300);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email)).WithMessage("Email must be valid.");
        RuleFor(x => x.Budget).GreaterThan(0).When(x => x.Budget.HasValue).WithMessage("Budget must be greater than zero.");
    }
}
