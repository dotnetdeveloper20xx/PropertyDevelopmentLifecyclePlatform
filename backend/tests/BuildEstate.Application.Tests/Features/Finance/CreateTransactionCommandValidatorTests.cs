using BuildEstate.Application.Features.Finance.Commands.CreateTransaction;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Finance;

public class CreateTransactionCommandValidatorTests
{
    private readonly CreateTransactionCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateTransactionCommand
        {
            ProjectId = Guid.NewGuid(),
            Description = "Concrete delivery payment",
            Amount = 12500m,
            Type = TransactionType.Expense
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyDescription_HasError()
    {
        var cmd = new CreateTransactionCommand
        {
            ProjectId = Guid.NewGuid(),
            Description = "",
            Amount = 12500m,
            Type = TransactionType.Expense
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_WithEmptyProjectId_HasError()
    {
        var cmd = new CreateTransactionCommand
        {
            ProjectId = Guid.Empty,
            Description = "Concrete delivery payment",
            Amount = 12500m,
            Type = TransactionType.Expense
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectId);
    }

    [Fact]
    public void Validate_WithZeroAmount_HasError()
    {
        var cmd = new CreateTransactionCommand
        {
            ProjectId = Guid.NewGuid(),
            Description = "Concrete delivery payment",
            Amount = 0m,
            Type = TransactionType.Expense
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Amount);
    }
}
