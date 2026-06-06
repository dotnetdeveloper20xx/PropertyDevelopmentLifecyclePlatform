using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.UpdateDueDiligence;

/// <summary>
/// Validates UpdateDueDiligenceCommand before handler execution.
/// </summary>
public class UpdateDueDiligenceCommandValidator : AbstractValidator<UpdateDueDiligenceCommand>
{
    private static readonly string[] AllowedRiskLevels = { "Low", "Medium", "High", "Critical" };

    public UpdateDueDiligenceCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Due diligence ID is required.");

        RuleFor(x => x.OpportunityId)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Status must be a valid value.");

        RuleFor(x => x.RiskLevel)
            .Must(level => AllowedRiskLevels.Contains(level!))
            .When(x => !string.IsNullOrWhiteSpace(x.RiskLevel))
            .WithMessage($"Risk level must be one of: {string.Join(", ", AllowedRiskLevels)}.");

        RuleFor(x => x.AssignedTo)
            .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.AssignedTo));
    }
}
