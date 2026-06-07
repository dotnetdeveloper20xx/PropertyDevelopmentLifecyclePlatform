using FluentValidation;
namespace BuildEstate.Application.Features.Finance.Commands.CreateTransaction;
public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
        RuleFor(x => x.Amount).NotEqual(0).WithMessage("Amount must not be zero.");
        RuleFor(x => x.Type).IsInEnum().WithMessage("Transaction type must be a valid value.");
    }
}
