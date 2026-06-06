using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.CreateDueDiligence;

/// <summary>
/// Validates CreateDueDiligenceCommand before handler execution.
/// </summary>
public class CreateDueDiligenceCommandValidator : AbstractValidator<CreateDueDiligenceCommand>
{
    public CreateDueDiligenceCommandValidator()
    {
        RuleFor(x => x.OpportunityId)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Due diligence type must be a valid value.");

        RuleFor(x => x.AssignedTo)
            .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.AssignedTo));
    }
}
