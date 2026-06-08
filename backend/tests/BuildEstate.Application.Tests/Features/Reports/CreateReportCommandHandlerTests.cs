using BuildEstate.Application.Features.Reports.Commands.CreateReport;
using BuildEstate.Domain.Entities.Reports;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Reports;

public class CreateReportCommandHandlerTests
{
    private readonly Mock<IRepository<SavedReport>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateReportCommandHandler>> _loggerMock;
    private readonly CreateReportCommandHandler _handler;

    public CreateReportCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<SavedReport>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateReportCommandHandler>>();
        _handler = new CreateReportCommandHandler(
            _repositoryMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsSavedReportDto()
    {
        // Arrange
        var cmd = new CreateReportCommand
        {
            Title = "Monthly Financial Summary",
            Description = "Overview of project finances for Q1 2024",
            ReportType = "Financial",
            Parameters = "{\"quarter\":\"Q1\",\"year\":2024}"
        };
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<SavedReport>(), default)).ReturnsAsync((SavedReport e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Monthly Financial Summary");
        result.ReportType.Should().Be("Financial");
        result.Parameters.Should().Contain("Q1");
        _repositoryMock.Verify(x => x.AddAsync(It.IsAny<SavedReport>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }
}
