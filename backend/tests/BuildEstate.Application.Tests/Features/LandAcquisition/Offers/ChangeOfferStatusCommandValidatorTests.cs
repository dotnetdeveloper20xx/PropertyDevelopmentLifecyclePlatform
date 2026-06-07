using BuildEstate.Application.Features.LandAcquisition.Offers.Commands.ChangeOfferStatus;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.Offers;

public class ChangeOfferStatusCommandValidatorTests
{
    private readonly ChangeOfferStatusCommandValidator _validator = new();

    [Fact]
    public void Validate_AcceptWithValidData_HasNoErrors()
    {
        var cmd = new ChangeOfferStatusCommand { Id = Guid.NewGuid(), OpportunityId = Guid.NewGuid(), NewStatus = OfferStatus.Accepted };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_CounterOfferedWithoutAmount_HasError()
    {
        var cmd = new ChangeOfferStatusCommand { Id = Guid.NewGuid(), OpportunityId = Guid.NewGuid(), NewStatus = OfferStatus.CounterOffered, CounterOfferAmount = null };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.CounterOfferAmount);
    }

    [Fact]
    public void Validate_CounterOfferedWithAmount_HasNoErrors()
    {
        var cmd = new ChangeOfferStatusCommand { Id = Guid.NewGuid(), OpportunityId = Guid.NewGuid(), NewStatus = OfferStatus.CounterOffered, CounterOfferAmount = 1500000 };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_EmptyOfferId_HasError()
    {
        var cmd = new ChangeOfferStatusCommand { Id = Guid.Empty, OpportunityId = Guid.NewGuid(), NewStatus = OfferStatus.Accepted };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Id);
    }
}
