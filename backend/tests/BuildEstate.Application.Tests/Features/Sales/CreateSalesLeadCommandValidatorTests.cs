using BuildEstate.Application.Features.Sales.Commands.CreateSalesLead;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Sales;

public class CreateSalesLeadCommandValidatorTests
{
    private readonly CreateSalesLeadCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateSalesLeadCommand
        {
            Name = "John Smith",
            Email = "john.smith@example.com",
            Phone = "07700900123"
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var cmd = new CreateSalesLeadCommand
        {
            Name = "",
            Email = "john.smith@example.com"
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithInvalidEmail_HasError()
    {
        var cmd = new CreateSalesLeadCommand
        {
            Name = "John Smith",
            Email = "invalid-email"
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Email);
    }
}
