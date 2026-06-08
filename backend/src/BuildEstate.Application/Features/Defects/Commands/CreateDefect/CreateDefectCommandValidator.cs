using BuildEstate.Domain.Enums;
using FluentValidation;

namespace BuildEstate.Application.Features.Defects.Commands.CreateDefect;

public class CreateDefectCommandValidator : AbstractValidator<CreateDefectCommand>
{
    public CreateDefectCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Defect title is required.").MaximumLength(500);
        RuleFor(x => x.Priority).IsInEnum().WithMessage("A valid priority level is required.");
    }
}
