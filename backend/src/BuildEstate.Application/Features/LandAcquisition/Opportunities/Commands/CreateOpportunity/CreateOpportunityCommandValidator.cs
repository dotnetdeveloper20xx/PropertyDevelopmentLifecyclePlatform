using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.CreateOpportunity;

/// <summary>
/// Validates CreateOpportunityCommand before handler execution.
/// Runs automatically via ValidationBehavior pipeline.
/// </summary>
public class CreateOpportunityCommandValidator : AbstractValidator<CreateOpportunityCommand>
{
    public CreateOpportunityCommandValidator()
    {
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

        RuleFor(x => x.EstimatedDevelopmentCost)
            .GreaterThan(0).When(x => x.EstimatedDevelopmentCost.HasValue)
            .WithMessage("Estimated development cost must be positive.");

        RuleFor(x => x.ROI)
            .InclusiveBetween(-100, 10000).When(x => x.ROI.HasValue)
            .WithMessage("ROI must be between -100% and 10000%.");

        RuleFor(x => x.PostCode)
            .MaximumLength(20).When(x => !string.IsNullOrEmpty(x.PostCode));

        RuleFor(x => x.Address)
            .MaximumLength(500).When(x => !string.IsNullOrEmpty(x.Address));

        RuleFor(x => x.ExpectedAcquisitionDate)
            .GreaterThan(DateTime.UtcNow.Date).When(x => x.ExpectedAcquisitionDate.HasValue)
            .WithMessage("Expected acquisition date must be in the future.");
    }
}
