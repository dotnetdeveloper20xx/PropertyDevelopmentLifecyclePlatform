using BuildEstate.Domain.Enums;
using FluentValidation;

namespace BuildEstate.Application.Features.Rentals.Commands.UpdateTenancy;

/// <summary>
/// Validates UpdateTenancyCommand before handler execution.
/// Full PUT — required fields must always be present.
/// </summary>
public class UpdateTenancyCommandValidator : AbstractValidator<UpdateTenancyCommand>
{
    public UpdateTenancyCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Tenancy ID is required.");

        RuleFor(x => x.TenantName)
            .NotEmpty().WithMessage("Tenant name is required.");

        RuleFor(x => x.MonthlyRent)
            .GreaterThan(0).WithMessage("Monthly rent must be greater than zero.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid tenancy status.");
    }
}
