using FluentValidation;
namespace BuildEstate.Application.Features.Procurement.Commands.CreateDelivery;
public class CreateDeliveryCommandValidator : AbstractValidator<CreateDeliveryCommand>
{
    public CreateDeliveryCommandValidator()
    {
        RuleFor(x => x.PurchaseOrderId).NotEmpty().WithMessage("Purchase order ID is required.");
    }
}
