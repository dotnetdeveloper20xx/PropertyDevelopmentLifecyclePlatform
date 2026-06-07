using BuildEstate.Application.Features.Finance.Commands.CreateBudgetLine;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Finance;

public class CreateBudgetLineCommandValidatorTests
{
    private readonly CreateBudgetLineCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateBudgetLineCommand
        {
            ProjectId = Guid.NewGuid(),
            Category = "Materials",
            PlannedAmount = 50000m
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyCategory_HasError()
    {
        var cmd = new CreateBudgetLineCommand
        {
            ProjectId = Guid.NewGuid(),
            Category = "",
            PlannedAmount = 50000m
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Category);
    }

    [Fact]
    public void Validate_WithEmptyProjectId_HasError()
    {
        var cmd = new CreateBudgetLineCommand
        {
            ProjectId = Guid.Empty,
            Category = "Materials",
            PlannedAmount = 50000m
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectId);
    }

    [Fact]
    public void Validate_WithZeroPlannedAmount_HasError()
    {
        var cmd = new CreateBudgetLineCommand
        {
            ProjectId = Guid.NewGuid(),
            Category = "Materials",
            PlannedAmount = 0m
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.PlannedAmount);
    }
}
