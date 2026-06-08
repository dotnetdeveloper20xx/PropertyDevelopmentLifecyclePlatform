using BuildEstate.Application.Features.Documents.Commands.CreateDocument;
using BuildEstate.Domain.Entities.Documents;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Documents;

public class CreateDocumentCommandHandlerTests
{
    private readonly Mock<IRepository<KnowledgeDocument>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateDocumentCommandHandler>> _loggerMock;
    private readonly CreateDocumentCommandHandler _handler;

    public CreateDocumentCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<KnowledgeDocument>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateDocumentCommandHandler>>();
        _handler = new CreateDocumentCommandHandler(
            _repositoryMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsKnowledgeDocumentDto()
    {
        // Arrange
        var cmd = new CreateDocumentCommand
        {
            ProjectId = Guid.NewGuid(),
            Title = "Site Survey Report",
            Description = "Initial ground survey findings",
            Category = DocumentCategory.Report,
            FileName = "site-survey-2024.pdf",
            FilePath = "/documents/site-survey-2024.pdf",
            FileSizeBytes = 2048000,
            Tags = "survey,ground,phase-1"
        };
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<KnowledgeDocument>(), default)).ReturnsAsync((KnowledgeDocument e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Site Survey Report");
        result.FileName.Should().Be("site-survey-2024.pdf");
        result.FileSizeBytes.Should().Be(2048000);
        result.Category.Should().Be(DocumentCategory.Report);
        _repositoryMock.Verify(x => x.AddAsync(It.IsAny<KnowledgeDocument>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }
}
