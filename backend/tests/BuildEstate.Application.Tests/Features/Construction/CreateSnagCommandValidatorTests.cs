using BuildEstate.Application.Features.Construction.Commands.CreateSnag;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Construction;

public class CreateSnagCommandValidatorTests
{
    private readonly CreateSnagCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateSnagCommand
        {
            ConstructionStageId = Guid.NewGuid(),
            Title = "Crack in foundation wall",
            Priority = SnagPriority.High
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var cmd = new CreateSnagCommand
        {
            ConstructionStageId = Guid.NewGuid(),
            Title = "",
            Priority = SnagPriority.Medium
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithEmptyStageId_HasError()
    {
        var cmd = new CreateSnagCommand
        {
            ConstructionStageId = Guid.Empty,
            Title = "Test",
            Priority = SnagPriority.Low
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ConstructionStageId);
    }
}
