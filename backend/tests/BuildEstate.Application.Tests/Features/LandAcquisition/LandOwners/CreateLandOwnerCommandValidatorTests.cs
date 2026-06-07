using BuildEstate.Application.Features.LandAcquisition.LandOwners.Commands.CreateLandOwner;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.LandOwners;

public class CreateLandOwnerCommandValidatorTests
{
    private readonly CreateLandOwnerCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateLandOwnerCommand { Name = "John Smith", OwnershipType = OwnershipType.Freehold };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var cmd = new CreateLandOwnerCommand { Name = "", OwnershipType = OwnershipType.Freehold };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithInvalidEmail_HasError()
    {
        var cmd = new CreateLandOwnerCommand { Name = "Test", ContactEmail = "not-an-email" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ContactEmail);
    }

    [Fact]
    public void Validate_WithValidEmail_HasNoErrors()
    {
        var cmd = new CreateLandOwnerCommand { Name = "Test", ContactEmail = "owner@example.com" };
        _validator.TestValidate(cmd).ShouldNotHaveValidationErrorFor(x => x.ContactEmail);
    }

    [Fact]
    public void Validate_WithNullEmail_HasNoErrors()
    {
        var cmd = new CreateLandOwnerCommand { Name = "Test", ContactEmail = null };
        _validator.TestValidate(cmd).ShouldNotHaveValidationErrorFor(x => x.ContactEmail);
    }
}
