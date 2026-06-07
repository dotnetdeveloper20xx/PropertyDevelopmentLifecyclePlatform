using BuildEstate.Application.Features.Units.Commands.CreatePropertyUnit;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Units;

public class CreatePropertyUnitCommandValidatorTests
{
    private readonly CreatePropertyUnitCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreatePropertyUnitCommand
        {
            ProjectId = Guid.NewGuid(),
            UnitReference = "UNIT-A101"
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyUnitReference_HasError()
    {
        var cmd = new CreatePropertyUnitCommand
        {
            ProjectId = Guid.NewGuid(),
            UnitReference = ""
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.UnitReference);
    }

    [Fact]
    public void Validate_WithEmptyProjectId_HasError()
    {
        var cmd = new CreatePropertyUnitCommand
        {
            ProjectId = Guid.Empty,
            UnitReference = "UNIT-A101"
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectId);
    }
}
