using BuildEstate.Application.Features.Construction.Commands.CreateInspection;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Construction;

public class CreateInspectionCommandValidatorTests
{
    private readonly CreateInspectionCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateInspectionCommand
        {
            ConstructionStageId = Guid.NewGuid(),
            Type = InspectionType.Foundation,
            ScheduledDate = DateTime.UtcNow.AddDays(7)
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyStageId_HasError()
    {
        var cmd = new CreateInspectionCommand
        {
            ConstructionStageId = Guid.Empty,
            Type = InspectionType.Structural,
            ScheduledDate = DateTime.UtcNow.AddDays(7)
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ConstructionStageId);
    }
}
