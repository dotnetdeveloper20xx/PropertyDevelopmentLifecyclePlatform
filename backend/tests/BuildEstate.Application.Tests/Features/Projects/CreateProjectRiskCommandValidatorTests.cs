using BuildEstate.Application.Features.Projects.Commands.CreateProjectRisk;
using FluentValidation.TestHelper;
namespace BuildEstate.Application.Tests.Features.Projects;
public class CreateProjectRiskCommandValidatorTests
{
    private readonly CreateProjectRiskCommandValidator _validator = new();
    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateProjectRiskCommand { ProjectId = Guid.NewGuid(), Title = "Ground contamination" };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }
    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var cmd = new CreateProjectRiskCommand { ProjectId = Guid.NewGuid(), Title = "" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Title);
    }
}
