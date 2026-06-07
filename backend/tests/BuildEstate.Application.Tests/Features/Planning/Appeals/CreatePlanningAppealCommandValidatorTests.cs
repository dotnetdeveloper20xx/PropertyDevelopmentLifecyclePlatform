using BuildEstate.Application.Features.Planning.Appeals.Commands.CreatePlanningAppeal;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Planning.Appeals;

public class CreatePlanningAppealCommandValidatorTests
{
    private readonly CreatePlanningAppealCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            AppealReference = "APP/2024/001",
            Grounds = "The council failed to consider material planning considerations"
        };
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyReference_HasError()
    {
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            AppealReference = "",
            Grounds = "Test"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.AppealReference);
    }

    [Fact]
    public void Validate_WithEmptyGrounds_HasError()
    {
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            AppealReference = "APP/2024/001",
            Grounds = ""
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Grounds);
    }

    [Fact]
    public void Validate_WithEmptyApplicationId_HasError()
    {
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = Guid.Empty,
            AppealReference = "APP/2024/001",
            Grounds = "Test"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.PlanningApplicationId);
    }
}
