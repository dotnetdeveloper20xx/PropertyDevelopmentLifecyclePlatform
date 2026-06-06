using FluentValidation;

namespace BuildEstate.Application.Features.Auth.Commands.Register;

/// <summary>
/// Validates registration command before handler execution.
/// Enforces password policy and required fields.
/// </summary>
public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    private static readonly string[] AllowedRoles =
    {
        "AcquisitionManager", "LegalOfficer", "PlanningManager",
        "ProjectManager", "SiteManager", "SalesManager",
        "CompletionManager", "PropertyManager", "FinanceDirector",
        "ValuationAnalyst", "Surveyor", "Admin"
    };

    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters.");

        RuleFor(x => x.Role)
            .Must(role => AllowedRoles.Contains(role!))
            .When(x => !string.IsNullOrWhiteSpace(x.Role))
            .WithMessage($"Role must be one of: {string.Join(", ", AllowedRoles)}. SuperAdmin cannot be self-assigned.");
    }
}
