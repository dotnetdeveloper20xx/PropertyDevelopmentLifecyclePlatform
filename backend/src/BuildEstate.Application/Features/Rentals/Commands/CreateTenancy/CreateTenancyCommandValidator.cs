using FluentValidation;
namespace BuildEstate.Application.Features.Rentals.Commands.CreateTenancy;
public class CreateTenancyCommandValidator : AbstractValidator<CreateTenancyCommand>
{
    public CreateTenancyCommandValidator()
    {
        RuleFor(x => x.PropertyUnitId).NotEmpty().WithMessage("Property unit ID is required.");
        RuleFor(x => x.TenantName).NotEmpty().WithMessage("Tenant name is required.").MaximumLength(300);
        RuleFor(x => x.MonthlyRent).GreaterThan(0).WithMessage("Monthly rent must be greater than zero.");
        RuleFor(x => x.LeaseEndDate).GreaterThan(x => x.LeaseStartDate).WithMessage("Lease end date must be after the start date.");
    }
}
