using FluentValidation;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.CreateComplianceCheck;

public class CreateComplianceCheckCommandValidator : AbstractValidator<CreateComplianceCheckCommand>
{
    public CreateComplianceCheckCommandValidator()
    {
        RuleFor(x => x.OpportunityId)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.CheckType)
            .IsInEnum().WithMessage("Check type must be a valid value.");

        RuleFor(x => x.AssignedTo)
            .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.AssignedTo));
    }
}
