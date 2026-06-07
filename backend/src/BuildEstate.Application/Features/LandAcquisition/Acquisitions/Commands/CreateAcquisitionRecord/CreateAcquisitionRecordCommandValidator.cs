using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Acquisitions.Commands.CreateAcquisitionRecord;

public class CreateAcquisitionRecordCommandValidator : AbstractValidator<CreateAcquisitionRecordCommand>
{
    public CreateAcquisitionRecordCommandValidator()
    {
        RuleFor(x => x.OpportunityId).NotEmpty();
        RuleFor(x => x.PurchasePrice).GreaterThan(0).WithMessage("Purchase price must be positive.");
        RuleFor(x => x.CompletionDate).NotEmpty().WithMessage("Completion date is required.");
        RuleFor(x => x.SolicitorName).MaximumLength(200);
    }
}
