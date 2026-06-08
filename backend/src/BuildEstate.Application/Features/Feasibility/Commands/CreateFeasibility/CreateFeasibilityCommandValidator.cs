using FluentValidation;

namespace BuildEstate.Application.Features.Feasibility.Commands.CreateFeasibility;

public class CreateFeasibilityCommandValidator : AbstractValidator<CreateFeasibilityCommand>
{
    public CreateFeasibilityCommandValidator()
    {
        RuleFor(x => x.OpportunityId).NotEmpty().WithMessage("Opportunity ID is required.");
        RuleFor(x => x.EstimatedLandCost).GreaterThan(0).WithMessage("Estimated land cost must be greater than zero.");
        RuleFor(x => x.EstimatedBuildCost).GreaterThan(0).WithMessage("Estimated build cost must be greater than zero.");
        RuleFor(x => x.ProfessionalFees).GreaterThan(0).WithMessage("Professional fees must be greater than zero.");
        RuleFor(x => x.FinanceCosts).GreaterThan(0).WithMessage("Finance costs must be greater than zero.");
        RuleFor(x => x.GrossDevelopmentValue).GreaterThan(0).WithMessage("Gross development value must be greater than zero.");
        RuleFor(x => x.ExpectedSalesRevenue).GreaterThan(0).WithMessage("Expected sales revenue must be greater than zero.");
    }
}
