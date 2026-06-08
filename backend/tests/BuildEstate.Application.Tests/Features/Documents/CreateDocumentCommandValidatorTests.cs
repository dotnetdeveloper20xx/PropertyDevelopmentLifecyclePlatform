using BuildEstate.Application.Features.Documents.Commands.CreateDocument;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.Documents;

public class CreateDocumentCommandValidatorTests
{
    private readonly CreateDocumentCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateDocumentCommand
        {
            Title = "Site Plans v2", FileName = "site-plans.pdf", Category = DocumentCategory.Planning
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyTitle_HasError()
    {
        var cmd = new CreateDocumentCommand { Title = "", FileName = "test.pdf", Category = DocumentCategory.Contract };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void Validate_WithEmptyFileName_HasError()
    {
        var cmd = new CreateDocumentCommand { Title = "Test", FileName = "", Category = DocumentCategory.Legal };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.FileName);
    }
}
