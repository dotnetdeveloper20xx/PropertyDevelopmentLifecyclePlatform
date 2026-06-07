using BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.CreateOpportunity;
using FluentAssertions;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.Opportunities;

public class CreateOpportunityCommandValidatorTests
{
    private readonly CreateOpportunityCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreateOpportunityCommand { Name = "Test", Location = "London", LandSize = 2.5m };
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var command = new CreateOpportunityCommand { Name = "", Location = "London", LandSize = 2.5m };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithEmptyLocation_HasError()
    {
        var command = new CreateOpportunityCommand { Name = "Test", Location = "", LandSize = 2.5m };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Location);
    }

    [Fact]
    public void Validate_WithZeroLandSize_HasError()
    {
        var command = new CreateOpportunityCommand { Name = "Test", Location = "London", LandSize = 0 };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.LandSize);
    }

    [Fact]
    public void Validate_WithNegativeLandSize_HasError()
    {
        var command = new CreateOpportunityCommand { Name = "Test", Location = "London", LandSize = -1 };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.LandSize);
    }
}
