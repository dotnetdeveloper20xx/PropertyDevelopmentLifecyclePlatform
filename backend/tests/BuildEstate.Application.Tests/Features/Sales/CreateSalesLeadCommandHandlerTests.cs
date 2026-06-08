using BuildEstate.Application.Features.Sales.Commands.CreateSalesLead;
using BuildEstate.Domain.Entities.Sales;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Sales;

public class CreateSalesLeadCommandHandlerTests
{
    private readonly Mock<IRepository<SalesLead>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateSalesLeadCommandHandler>> _loggerMock;
    private readonly CreateSalesLeadCommandHandler _handler;

    public CreateSalesLeadCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<SalesLead>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateSalesLeadCommandHandler>>();
        _handler = new CreateSalesLeadCommandHandler(
            _repositoryMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsSalesLeadDtoWithStatusNew()
    {
        // Arrange
        var cmd = new CreateSalesLeadCommand
        {
            ProjectId = Guid.NewGuid(),
            Name = "Jane Doe",
            Email = "jane@example.com",
            Phone = "07700 900123",
            Source = "Website",
            InterestDetails = "Interested in 2-bed apartment",
            Budget = 400000m,
            Notes = "Follow up next week"
        };
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<SalesLead>(), default)).ReturnsAsync((SalesLead e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Jane Doe");
        result.Email.Should().Be("jane@example.com");
        result.Source.Should().Be("Website");
        result.Status.Should().Be(LeadStatus.New);
        _repositoryMock.Verify(x => x.AddAsync(It.IsAny<SalesLead>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }
}
