using BuildEstate.Application.Features.Construction.Commands.CreateConstructionStage;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Construction;

public class CreateConstructionStageCommandValidatorTests
{
    private readonly CreateConstructionStageCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateConstructionStageCommand { ProjectId = Guid.NewGuid(), Name = "Foundations" };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var cmd = new CreateConstructionStageCommand { ProjectId = Guid.NewGuid(), Name = "" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WithEmptyProjectId_HasError()
    {
        var cmd = new CreateConstructionStageCommand { ProjectId = Guid.Empty, Name = "Test" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectId);
    }
}
