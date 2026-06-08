using BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Investors;

public class CreateInvestorCommandHandlerTests
{
    private readonly Mock<IRepository<Investor>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateInvestorCommandHandler>> _loggerMock;
    private readonly CreateInvestorCommandHandler _handler;

    public CreateInvestorCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<Investor>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateInvestorCommandHandler>>();
        _handler = new CreateInvestorCommandHandler(
            _repositoryMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsInvestorDtoWithCorrectFields()
    {
        // Arrange
        var cmd = new CreateInvestorCommand
        {
            Name = "Acme Capital",
            Type = InvestorType.Corporate,
            ContactName = "John Smith",
            Email = "john@acmecapital.com",
            Phone = "020 7123 4567",
            Notes = "Preferred investor"
        };
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<Investor>(), default)).ReturnsAsync((Investor e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Acme Capital");
        result.Type.Should().Be(InvestorType.Corporate);
        result.ContactName.Should().Be("John Smith");
        result.Email.Should().Be("john@acmecapital.com");
        _repositoryMock.Verify(x => x.AddAsync(It.IsAny<Investor>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithValidData_SetsDefaultFinancialFieldsToZero()
    {
        // Arrange
        var cmd = new CreateInvestorCommand
        {
            Name = "Individual Investor",
            Type = InvestorType.Individual
        };
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<Investor>(), default)).ReturnsAsync((Investor e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.TotalCommitted.Should().Be(0);
        result.TotalDeployed.Should().Be(0);
    }
}
