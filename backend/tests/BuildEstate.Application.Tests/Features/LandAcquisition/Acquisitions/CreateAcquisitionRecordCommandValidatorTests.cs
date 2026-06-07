using BuildEstate.Application.Features.LandAcquisition.Acquisitions.Commands.CreateAcquisitionRecord;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.Acquisitions;

public class CreateAcquisitionRecordCommandValidatorTests
{
    private readonly CreateAcquisitionRecordCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateAcquisitionRecordCommand
        {
            OpportunityId = Guid.NewGuid(),
            PurchasePrice = 4500000,
            CompletionDate = DateTime.UtcNow
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithZeroPurchasePrice_HasError()
    {
        var cmd = new CreateAcquisitionRecordCommand { OpportunityId = Guid.NewGuid(), PurchasePrice = 0, CompletionDate = DateTime.UtcNow };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.PurchasePrice);
    }

    [Fact]
    public void Validate_WithEmptyCompletionDate_HasError()
    {
        var cmd = new CreateAcquisitionRecordCommand { OpportunityId = Guid.NewGuid(), PurchasePrice = 1000000, CompletionDate = default };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.CompletionDate);
    }

    [Fact]
    public void Validate_WithEmptyOpportunityId_HasError()
    {
        var cmd = new CreateAcquisitionRecordCommand { OpportunityId = Guid.Empty, PurchasePrice = 1000000, CompletionDate = DateTime.UtcNow };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.OpportunityId);
    }
}
