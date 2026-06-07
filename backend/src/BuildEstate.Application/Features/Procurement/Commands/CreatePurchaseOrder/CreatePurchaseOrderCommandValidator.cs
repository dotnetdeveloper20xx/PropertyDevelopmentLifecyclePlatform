using FluentValidation;
namespace BuildEstate.Application.Features.Procurement.Commands.CreatePurchaseOrder;
public class CreatePurchaseOrderCommandValidator : AbstractValidator<CreatePurchaseOrderCommand>
{
    public CreatePurchaseOrderCommandValidator()
    {
        RuleFor(x => x.ProjectId).NotEmpty().WithMessage("Project ID is required.");
        RuleFor(x => x.OrderReference).NotEmpty().WithMessage("Order reference is required.").MaximumLength(100);
        RuleFor(x => x.SupplierName).NotEmpty().WithMessage("Supplier name is required.").MaximumLength(300);
        RuleFor(x => x.TotalValue).GreaterThan(0).WithMessage("Total value must be greater than zero.");
    }
}
