using FluentValidation;
namespace BuildEstate.Application.Features.Construction.Commands.CreateSnag;
public class CreateSnagCommandValidator : AbstractValidator<CreateSnagCommand>
{
    public CreateSnagCommandValidator()
    {
        RuleFor(x => x.ConstructionStageId).NotEmpty().WithMessage("Construction stage ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Snag title is required.").MaximumLength(500);
        RuleFor(x => x.Priority).IsInEnum().WithMessage("Invalid snag priority.");
    }
}
