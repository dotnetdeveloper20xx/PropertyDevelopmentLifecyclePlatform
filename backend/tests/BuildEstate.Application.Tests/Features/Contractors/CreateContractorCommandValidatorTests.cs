using BuildEstate.Application.Features.Contractors.Commands.CreateContractor;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Contractors;

public class CreateContractorCommandValidatorTests
{
    private readonly CreateContractorCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateContractorCommand { CompanyName = "ABC Construction", Type = ContractorType.MainContractor };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var cmd = new CreateContractorCommand { CompanyName = "", Type = ContractorType.Subcontractor };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.CompanyName);
    }

    [Fact]
    public void Validate_WithInvalidEmail_HasError()
    {
        var cmd = new CreateContractorCommand
        {
            CompanyName = "Test Ltd", Type = ContractorType.Supplier, Email = "not-valid"
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validate_WithValidEmail_HasNoError()
    {
        var cmd = new CreateContractorCommand
        {
            CompanyName = "Test Ltd", Type = ContractorType.Consultant, Email = "info@test.com"
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }
}
