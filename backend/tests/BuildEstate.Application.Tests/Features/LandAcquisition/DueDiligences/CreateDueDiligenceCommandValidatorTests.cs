using BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.CreateDueDiligence;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.DueDiligences;

public class CreateDueDiligenceCommandValidatorTests
{
    private readonly CreateDueDiligenceCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreateDueDiligenceCommand { OpportunityId = Guid.NewGuid(), Type = DueDiligenceType.Legal };
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyOpportunityId_HasError()
    {
        var command = new CreateDueDiligenceCommand { OpportunityId = Guid.Empty, Type = DueDiligenceType.Legal };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.OpportunityId);
    }

    [Fact]
    public void Validate_WithInvalidType_HasError()
    {
        var command = new CreateDueDiligenceCommand { OpportunityId = Guid.NewGuid(), Type = (DueDiligenceType)99 };
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Type);
    }
}
