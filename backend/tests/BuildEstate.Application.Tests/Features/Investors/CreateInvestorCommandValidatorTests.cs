using BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Investors;

public class CreateInvestorCommandValidatorTests
{
    private readonly CreateInvestorCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateInvestorCommand
        {
            Name = "Acme Capital Partners",
            Type = InvestorType.Institutional,
            Email = "info@acmecapital.com"
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var cmd = new CreateInvestorCommand
        {
            Name = "",
            Type = InvestorType.Institutional
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithInvalidEmail_HasError()
    {
        var cmd = new CreateInvestorCommand
        {
            Name = "Acme Capital Partners",
            Type = InvestorType.Institutional,
            Email = "not-an-email"
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Email);
    }
}
