using BuildEstate.Application.Features.Legal.Tasks.Commands.CreateLegalTask;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Legal.Tasks;

public class CreateLegalTaskCommandValidatorTests
{
    private readonly CreateLegalTaskCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreateLegalTaskCommand { Title = "Test Task" };
        _validator.TestValidate(command).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var command = new CreateLegalTaskCommand { Title = "" };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.Title);
    }
}
