using BuildEstate.Application.Features.Planning.Conditions.Commands.CreatePlanningCondition;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Planning.Conditions;

public class CreatePlanningConditionCommandValidatorTests
{
    private readonly CreatePlanningConditionCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            Title = "Landscaping Scheme",
            Description = "Submit details of landscaping"
        };
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            Title = "",
            Description = "Test"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithEmptyDescription_HasError()
    {
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            Title = "Test",
            Description = ""
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_WithEmptyApplicationId_HasError()
    {
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = Guid.Empty,
            Title = "Test",
            Description = "Test"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.PlanningApplicationId);
    }
}
