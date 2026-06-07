using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.LandOwners.Commands.CreateLandOwner;

public class CreateLandOwnerCommandValidator : AbstractValidator<CreateLandOwnerCommand>
{
    public CreateLandOwnerCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Owner name is required.");
        RuleFor(x => x.ContactEmail).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.ContactEmail));
        RuleFor(x => x.OwnershipType).IsInEnum();
    }
}
