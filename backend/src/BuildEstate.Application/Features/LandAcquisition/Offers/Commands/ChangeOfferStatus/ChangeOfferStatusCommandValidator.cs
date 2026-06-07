using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Commands.ChangeOfferStatus;

public class ChangeOfferStatusCommandValidator : AbstractValidator<ChangeOfferStatusCommand>
{
    public ChangeOfferStatusCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Offer ID is required.");
        RuleFor(x => x.OpportunityId).NotEmpty().WithMessage("Opportunity ID is required.");
        RuleFor(x => x.NewStatus).IsInEnum().WithMessage("New status must be a valid offer status.");

        RuleFor(x => x.CounterOfferAmount)
            .NotNull()
            .GreaterThan(0)
            .When(x => x.NewStatus == Domain.Enums.OfferStatus.CounterOffered)
            .WithMessage("Counter-offer amount is required when status is 'Counter-Offered'.");
    }
}
