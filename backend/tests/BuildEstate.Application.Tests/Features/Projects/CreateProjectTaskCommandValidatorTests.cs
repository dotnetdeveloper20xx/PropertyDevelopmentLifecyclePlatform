using BuildEstate.Application.Features.Projects.Commands.CreateProjectTask;
using FluentValidation.TestHelper;
namespace BuildEstate.Application.Tests.Features.Projects;
public class CreateProjectTaskCommandValidatorTests
{
    private readonly CreateProjectTaskCommandValidator _validator = new();
    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateProjectTaskCommand { ProjectId = Guid.NewGuid(), Title = "Order materials" };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }
    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var cmd = new CreateProjectTaskCommand { ProjectId = Guid.NewGuid(), Title = "" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Title);
    }
}
