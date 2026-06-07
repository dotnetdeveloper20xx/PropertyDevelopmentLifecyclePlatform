using BuildEstate.Application.Features.Projects.Commands.CreateMilestone;
using FluentValidation.TestHelper;
namespace BuildEstate.Application.Tests.Features.Projects;
public class CreateMilestoneCommandValidatorTests
{
    private readonly CreateMilestoneCommandValidator _validator = new();
    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateMilestoneCommand { ProjectId = Guid.NewGuid(), Title = "Foundation Complete", TargetDate = DateTime.UtcNow.AddMonths(3) };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }
    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var cmd = new CreateMilestoneCommand { ProjectId = Guid.NewGuid(), Title = "", TargetDate = DateTime.UtcNow.AddMonths(3) };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Title);
    }
    [Fact]
    public void Validate_WithEmptyProjectId_HasError()
    {
        var cmd = new CreateMilestoneCommand { ProjectId = Guid.Empty, Title = "Test", TargetDate = DateTime.UtcNow.AddMonths(3) };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectId);
    }
}
