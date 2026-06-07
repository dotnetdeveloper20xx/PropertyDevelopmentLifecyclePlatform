using BuildEstate.Application.Features.Projects.Commands.CreateProject;
using FluentValidation.TestHelper;
namespace BuildEstate.Application.Tests.Features.Projects;
public class CreateProjectCommandValidatorTests
{
    private readonly CreateProjectCommandValidator _validator = new();
    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "Test", ProjectReference = "PRJ/001" };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }
    [Fact]
    public void Validate_WithEmptyName_HasError()
    {
        var cmd = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "", ProjectReference = "PRJ/001" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Name);
    }
    [Fact]
    public void Validate_WithEmptyReference_HasError()
    {
        var cmd = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "Test", ProjectReference = "" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectReference);
    }
    [Fact]
    public void Validate_WithEmptyOpportunityId_HasError()
    {
        var cmd = new CreateProjectCommand { OpportunityId = Guid.Empty, Name = "Test", ProjectReference = "PRJ/001" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.OpportunityId);
    }
    [Fact]
    public void Validate_WithNegativeBudget_HasError()
    {
        var cmd = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "Test", ProjectReference = "PRJ/001", Budget = -1 };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Budget);
    }
}
