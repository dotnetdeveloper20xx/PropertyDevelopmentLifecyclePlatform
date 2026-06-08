using BuildEstate.Domain.Enums;
using FluentValidation;

namespace BuildEstate.Application.Features.Documents.Commands.CreateDocument;

public class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
{
    public CreateDocumentCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Document title is required.")
            .MaximumLength(500).WithMessage("Document title must not exceed 500 characters.");

        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("File name is required.");

        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("A valid document category is required.");
    }
}
