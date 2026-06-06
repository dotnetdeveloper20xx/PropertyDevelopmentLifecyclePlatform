using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Commands.CreateOffer;

/// <summary>
/// Validates CreateOfferCommand before handler execution.
/// </summary>
public class CreateOfferCommandValidator : AbstractValidator<CreateOfferCommand>
{
    private static readonly string[] AllowedCurrencies = { "GBP", "EUR", "USD" };

    public CreateOfferCommandValidator()
    {
        RuleFor(x => x.OpportunityId)
            .NotEmpty().WithMessage("Opportunity ID is required.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Offer amount must be positive.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .Must(c => AllowedCurrencies.Contains(c))
            .WithMessage($"Currency must be one of: {string.Join(", ", AllowedCurrencies)}.");

        RuleFor(x => x.ValidUntil)
            .GreaterThan(DateTime.UtcNow.Date).When(x => x.ValidUntil.HasValue)
            .WithMessage("Valid until date must be in the future.");
    }
}
