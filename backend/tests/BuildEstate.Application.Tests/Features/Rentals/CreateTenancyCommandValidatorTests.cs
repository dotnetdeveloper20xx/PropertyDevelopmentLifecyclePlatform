using BuildEstate.Application.Features.Rentals.Commands.CreateTenancy;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Rentals;

public class CreateTenancyCommandValidatorTests
{
    private readonly CreateTenancyCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateTenancyCommand
        {
            PropertyUnitId = Guid.NewGuid(),
            TenantName = "Jane Doe",
            MonthlyRent = 1500m,
            LeaseStartDate = new DateTime(2025, 1, 1),
            LeaseEndDate = new DateTime(2026, 1, 1)
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTenantName_HasError()
    {
        var cmd = new CreateTenancyCommand
        {
            PropertyUnitId = Guid.NewGuid(),
            TenantName = "",
            MonthlyRent = 1500m,
            LeaseStartDate = new DateTime(2025, 1, 1),
            LeaseEndDate = new DateTime(2026, 1, 1)
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.TenantName);
    }

    [Fact]
    public void Validate_WithZeroRent_HasError()
    {
        var cmd = new CreateTenancyCommand
        {
            PropertyUnitId = Guid.NewGuid(),
            TenantName = "Jane Doe",
            MonthlyRent = 0m,
            LeaseStartDate = new DateTime(2025, 1, 1),
            LeaseEndDate = new DateTime(2026, 1, 1)
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.MonthlyRent);
    }

    [Fact]
    public void Validate_WithEndDateBeforeStartDate_HasError()
    {
        var cmd = new CreateTenancyCommand
        {
            PropertyUnitId = Guid.NewGuid(),
            TenantName = "Jane Doe",
            MonthlyRent = 1500m,
            LeaseStartDate = new DateTime(2026, 1, 1),
            LeaseEndDate = new DateTime(2025, 1, 1)
        };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.LeaseEndDate);
    }
}
