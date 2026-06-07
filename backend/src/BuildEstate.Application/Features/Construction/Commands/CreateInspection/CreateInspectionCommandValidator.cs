using BuildEstate.Domain.Enums;
using FluentValidation;
namespace BuildEstate.Application.Features.Construction.Commands.CreateInspection;
public class CreateInspectionCommandValidator : AbstractValidator<CreateInspectionCommand>
{
    public CreateInspectionCommandValidator()
    {
        RuleFor(x => x.ConstructionStageId).NotEmpty().WithMessage("Construction stage ID is required.");
        RuleFor(x => x.Type).IsInEnum().WithMessage("Invalid inspection type.");
        RuleFor(x => x.ScheduledDate).GreaterThan(DateTime.UtcNow.AddDays(-1)).WithMessage("Scheduled date must be today or in the future.");
    }
}
