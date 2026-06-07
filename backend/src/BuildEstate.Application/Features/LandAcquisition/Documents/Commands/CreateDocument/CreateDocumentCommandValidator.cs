using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Documents.Commands.CreateDocument;

public class CreateDocumentCommandValidator : AbstractValidator<CreateDocumentCommand>
{
    private static readonly string[] AllowedContentTypes =
    [
        "application/pdf", "image/jpeg", "image/png",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    public CreateDocumentCommandValidator()
    {
        RuleFor(x => x.OpportunityId).NotEmpty();
        RuleFor(x => x.FileName).NotEmpty().MaximumLength(255);
        RuleFor(x => x.DocType).IsInEnum();
        RuleFor(x => x.FileSizeBytes).GreaterThan(0).LessThanOrEqualTo(50 * 1024 * 1024)
            .WithMessage("File size must not exceed 50MB.");
        RuleFor(x => x.FilePath).NotEmpty();
    }
}
