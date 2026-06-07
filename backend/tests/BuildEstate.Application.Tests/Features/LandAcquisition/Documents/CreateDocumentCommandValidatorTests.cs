using BuildEstate.Application.Features.LandAcquisition.Documents.Commands.CreateDocument;
using BuildEstate.Domain.Enums;
using FluentValidation.TestHelper;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.Documents;

public class CreateDocumentCommandValidatorTests
{
    private readonly CreateDocumentCommandValidator _validator = new();

    [Fact]
    public void Validate_WithValidData_HasNoErrors()
    {
        var cmd = new CreateDocumentCommand
        {
            OpportunityId = Guid.NewGuid(),
            FileName = "Title_Deed.pdf",
            DocType = DocumentType.TitleDeed,
            FileSizeBytes = 1024 * 100,
            FilePath = "/uploads/Title_Deed.pdf"
        };
        _validator.TestValidate(cmd).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WithEmptyFileName_HasError()
    {
        var cmd = new CreateDocumentCommand { OpportunityId = Guid.NewGuid(), FileName = "", DocType = DocumentType.TitleDeed, FileSizeBytes = 1024, FilePath = "/test" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.FileName);
    }

    [Fact]
    public void Validate_WithZeroFileSize_HasError()
    {
        var cmd = new CreateDocumentCommand { OpportunityId = Guid.NewGuid(), FileName = "test.pdf", DocType = DocumentType.Other, FileSizeBytes = 0, FilePath = "/test" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.FileSizeBytes);
    }

    [Fact]
    public void Validate_ExceedsMaxFileSize_HasError()
    {
        var cmd = new CreateDocumentCommand { OpportunityId = Guid.NewGuid(), FileName = "big.pdf", DocType = DocumentType.Other, FileSizeBytes = 51 * 1024 * 1024, FilePath = "/test" };
        _validator.TestValidate(cmd).ShouldHaveValidationErrorFor(x => x.FileSizeBytes);
    }

    [Fact]
    public void Validate_ExactlyMaxFileSize_HasNoErrors()
    {
        var cmd = new CreateDocumentCommand { OpportunityId = Guid.NewGuid(), FileName = "max.pdf", DocType = DocumentType.Other, FileSizeBytes = 50 * 1024 * 1024, FilePath = "/test" };
        _validator.TestValidate(cmd).ShouldNotHaveValidationErrorFor(x => x.FileSizeBytes);
    }
}
