using FluentValidation;
namespace BuildEstate.Application.Features.Contractors.Commands.CreateContractor;
public class CreateContractorCommandValidator : AbstractValidator<CreateContractorCommand>
{
    public CreateContractorCommandValidator()
    {
        RuleFor(x => x.CompanyName).NotEmpty().WithMessage("Company name is required.").MaximumLength(300);
        RuleFor(x => x.Type).IsInEnum().WithMessage("Contractor type must be a valid value.");
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email)).WithMessage("Email must be valid.");
    }
}
