using BuildEstate.Application.Features.Legal.Contracts.Commands.CreateContract;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Legal.Contracts;

public class CreateContractCommandValidatorTests
{
    private readonly CreateContractCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(), Title = "Test Contract",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "CON/001", CounterpartyName = "Test Ltd"
        };
        _validator.TestValidate(command).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(), Title = "",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "CON/001", CounterpartyName = "Test Ltd"
        };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithEmptyReference_HasError()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(), Title = "Test",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "", CounterpartyName = "Test Ltd"
        };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.ContractReference);
    }

    [Fact]
    public void Validate_WithEmptyCounterparty_HasError()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(), Title = "Test",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "CON/001", CounterpartyName = ""
        };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.CounterpartyName);
    }

    [Fact]
    public void Validate_WithNegativeValue_HasError()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(), Title = "Test",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "CON/001", CounterpartyName = "Test Ltd",
            ContractValue = -100
        };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.ContractValue);
    }

    [Fact]
    public void Validate_WithInvalidEmail_HasError()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(), Title = "Test",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "CON/001", CounterpartyName = "Test Ltd",
            SolicitorEmail = "not-valid"
        };
        _validator.TestValidate(command).ShouldHaveValidationErrorFor(x => x.SolicitorEmail);
    }
}
