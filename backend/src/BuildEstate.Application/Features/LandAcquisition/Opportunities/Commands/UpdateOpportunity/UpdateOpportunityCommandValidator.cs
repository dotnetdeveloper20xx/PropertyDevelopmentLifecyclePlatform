using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.UpdateOpportunity;

/// <summary>
/// Validates UpdateOpportunityCommand before handler execution.
/// </summary>
public class UpdateOpportunityCommandValidator : AbstractValidator<UpdateOpportunityCommand>
{
    public UpdateOpportunityCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Opportunity name is required.")
            .MaximumLength(200).WithMessage("Opportunity name cannot exceed 200 characters.");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required.")
            .MaximumLength(500).WithMessage("Location cannot exceed 500 characters.");

        RuleFor(x => x.LandSize)
            .GreaterThan(0).WithMessage("Land size must be greater than zero.");

        RuleFor(x => x.AskingPrice)
            .GreaterThan(0).When(x => x.AskingPrice.HasValue)
            .WithMessage("Asking price must be positive.");

        RuleFor(x => x.EstimatedValue)
            .GreaterThan(0).When(x => x.EstimatedValue.HasValue)
            .WithMessage("Estimated value must be positive.");
    }
}
