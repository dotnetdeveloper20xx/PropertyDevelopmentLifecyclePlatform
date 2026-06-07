using BuildEstate.Application.Features.Procurement.Commands.CreatePurchaseOrder;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Procurement;

public class CreatePurchaseOrderCommandValidatorTests
{
    private readonly CreatePurchaseOrderCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.NewGuid(), OrderReference = "PO/2024/001",
            SupplierName = "Builder Supplies Ltd", TotalValue = 5000
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyReference_HasError()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.NewGuid(), OrderReference = "",
            SupplierName = "Test", TotalValue = 1000
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.OrderReference);
    }

    [Fact]
    public void Validate_WithEmptySupplier_HasError()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.NewGuid(), OrderReference = "PO/001",
            SupplierName = "", TotalValue = 1000
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.SupplierName);
    }

    [Fact]
    public void Validate_WithZeroValue_HasError()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.NewGuid(), OrderReference = "PO/001",
            SupplierName = "Test", TotalValue = 0
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.TotalValue);
    }

    [Fact]
    public void Validate_WithEmptyProjectId_HasError()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.Empty, OrderReference = "PO/001",
            SupplierName = "Test", TotalValue = 1000
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ProjectId);
    }
}
