using FluentValidation;

namespace BuildEstate.Application.Features.Legal.Contracts.Commands.ChangeContractStatus;

public class ChangeContractStatusCommandValidator : AbstractValidator<ChangeContractStatusCommand>
{
    public ChangeContractStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Contract ID is required.");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("New status must be a valid contract status.");
    }
}
