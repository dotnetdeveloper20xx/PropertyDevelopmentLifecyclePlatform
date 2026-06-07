using FluentValidation;

namespace BuildEstate.Application.Features.Legal.Contracts.Commands.CreateContract;

public class CreateContractCommandValidator : AbstractValidator<CreateContractCommand>
{
    public CreateContractCommandValidator()
    {
        RuleFor(x => x.OpportunityId)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Contract title is required.")
            .MaximumLength(500).WithMessage("Title cannot exceed 500 characters.");

        RuleFor(x => x.ContractType)
            .IsInEnum().WithMessage("Contract type must be a valid value.");

        RuleFor(x => x.ContractReference)
            .NotEmpty().WithMessage("Contract reference is required.")
            .MaximumLength(100).WithMessage("Contract reference cannot exceed 100 characters.");

        RuleFor(x => x.CounterpartyName)
            .NotEmpty().WithMessage("Counterparty name is required.")
            .MaximumLength(300).WithMessage("Counterparty name cannot exceed 300 characters.");

        RuleFor(x => x.ContractValue)
            .GreaterThan(0).When(x => x.ContractValue.HasValue)
            .WithMessage("Contract value must be positive.");

        RuleFor(x => x.SolicitorEmail)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.SolicitorEmail))
            .WithMessage("Solicitor email must be a valid email address.");
    }
}
