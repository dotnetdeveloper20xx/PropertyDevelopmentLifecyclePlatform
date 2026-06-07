using FluentValidation;

namespace BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.ChangeComplianceStatus;

public class ChangeComplianceStatusCommandValidator : AbstractValidator<ChangeComplianceStatusCommand>
{
    public ChangeComplianceStatusCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Compliance check ID is required.");

        RuleFor(x => x.OpportunityId)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.NewStatus)
            .IsInEnum().WithMessage("New status must be a valid compliance check status.");

        RuleFor(x => x.RiskLevel)
            .IsInEnum().When(x => x.RiskLevel.HasValue)
            .WithMessage("Risk level must be a valid value.");
    }
}
