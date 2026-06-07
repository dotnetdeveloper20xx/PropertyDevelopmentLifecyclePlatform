using BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.CreateComplianceCheck;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Legal.ComplianceChecks;

public class CreateComplianceCheckCommandValidatorTests
{
    private readonly CreateComplianceCheckCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreateComplianceCheckCommand
        {
            OpportunityId = Guid.NewGuid(), CheckType = ComplianceCheckType.AML
        };
        _validator.TestValidate(command).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyOpportunityId_HasError()
    {
        var command = new CreateComplianceCheckCommand
        {
            OpportunityId = Guid.Empty, CheckType = ComplianceCheckType.AML
        };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.OpportunityId);
    }
}
