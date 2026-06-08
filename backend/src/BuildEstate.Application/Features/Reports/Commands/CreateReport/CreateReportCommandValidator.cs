using FluentValidation;

namespace BuildEstate.Application.Features.Reports.Commands.CreateReport;

public class CreateReportCommandValidator : AbstractValidator<CreateReportCommand>
{
    public CreateReportCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Report title is required.")
            .MaximumLength(300).WithMessage("Report title must not exceed 300 characters.");

        RuleFor(x => x.ReportType)
            .NotEmpty().WithMessage("Report type is required.");
    }
}
