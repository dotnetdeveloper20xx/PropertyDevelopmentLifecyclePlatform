using BuildEstate.Application.Features.Planning.Applications.Commands.CreatePlanningApplication;
using FluentAssertions;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Planning.Applications;

public class CreatePlanningApplicationCommandValidatorTests
{
    private readonly CreatePlanningApplicationCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "Full planning for 50 dwellings",
            LocalAuthority = "Westminster Council",
            ApplicationType = "Full Planning"
        };
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyReference_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "",
            Description = "Test",
            LocalAuthority = "Test Council",
            ApplicationType = "Full"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ApplicationReference);
    }

    [Fact]
    public void Validate_WithEmptyDescription_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "",
            LocalAuthority = "Test Council",
            ApplicationType = "Full"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_WithEmptyLocalAuthority_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "Test",
            LocalAuthority = "",
            ApplicationType = "Full"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.LocalAuthority);
    }

    [Fact]
    public void Validate_WithEmptyApplicationType_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "Test",
            LocalAuthority = "Test Council",
            ApplicationType = ""
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ApplicationType);
    }

    [Fact]
    public void Validate_WithEmptyOpportunityId_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.Empty,
            ApplicationReference = "PA/2024/001",
            Description = "Test",
            LocalAuthority = "Test Council",
            ApplicationType = "Full"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.OpportunityId);
    }

    [Fact]
    public void Validate_WithNegativeApplicationFee_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "Test",
            LocalAuthority = "Test Council",
            ApplicationType = "Full",
            ApplicationFee = -100
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ApplicationFee);
    }

    [Fact]
    public void Validate_WithInvalidEmail_HasError()
    {
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "Test",
            LocalAuthority = "Test Council",
            ApplicationType = "Full",
            CaseOfficerEmail = "not-an-email"
        };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CaseOfficerEmail);
    }
}
