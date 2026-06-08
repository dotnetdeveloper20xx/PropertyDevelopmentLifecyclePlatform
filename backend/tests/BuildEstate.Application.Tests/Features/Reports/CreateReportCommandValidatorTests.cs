using BuildEstate.Application.Features.Reports.Commands.CreateReport;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Reports;

public class CreateReportCommandValidatorTests
{
    private readonly CreateReportCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateReportCommand { Title = "Monthly Financial Report", ReportType = "Financial" };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var cmd = new CreateReportCommand { Title = "", ReportType = "Financial" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithEmptyReportType_HasError()
    {
        var cmd = new CreateReportCommand { Title = "Test Report", ReportType = "" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.ReportType);
    }
}
