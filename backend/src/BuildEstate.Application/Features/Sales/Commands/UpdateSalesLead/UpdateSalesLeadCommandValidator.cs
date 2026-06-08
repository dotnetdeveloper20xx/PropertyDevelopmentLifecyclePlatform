using BuildEstate.Domain.Enums;
using FluentValidation;

namespace BuildEstate.Application.Features.Sales.Commands.UpdateSalesLead;

/// <summary>
/// Validates UpdateSalesLeadCommand before handler execution.
/// Full PUT — required fields must always be present.
/// </summary>
public class UpdateSalesLeadCommandValidator : AbstractValidator<UpdateSalesLeadCommand>
{
    public UpdateSalesLeadCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Sales lead ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid lead status.");
    }
}
