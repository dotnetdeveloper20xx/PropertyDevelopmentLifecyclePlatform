using BuildEstate.Application.Features.Finance.Commands.CreateTransaction;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Finance;

public class CreateTransactionCommandHandlerTests
{
    private readonly Mock<IRepository<Project>> _projectRepoMock;
    private readonly Mock<IRepository<FinancialTransaction>> _transactionRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateTransactionCommandHandler>> _loggerMock;
    private readonly CreateTransactionCommandHandler _handler;

    public CreateTransactionCommandHandlerTests()
    {
        _projectRepoMock = new Mock<IRepository<Project>>();
        _transactionRepoMock = new Mock<IRepository<FinancialTransaction>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateTransactionCommandHandler>>();
        _handler = new CreateTransactionCommandHandler(
            _projectRepoMock.Object, _transactionRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsFinancialTransactionDto()
    {
        // Arrange
        var cmd = new CreateTransactionCommand
        {
            ProjectId = Guid.NewGuid(),
            Type = TransactionType.Expense,
            Description = "Materials purchase",
            Amount = 12500m,
            Category = "Construction",
            Reference = "TXN/2024/001",
            Notes = "Paid to supplier"
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(true);
        _transactionRepoMock.Setup(x => x.AddAsync(It.IsAny<FinancialTransaction>(), default)).ReturnsAsync((FinancialTransaction e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Description.Should().Be("Materials purchase");
        result.Amount.Should().Be(12500m);
        result.Currency.Should().Be("GBP");
        result.Type.Should().Be(TransactionType.Expense);
        _transactionRepoMock.Verify(x => x.AddAsync(It.IsAny<FinancialTransaction>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentProject_ThrowsNotFoundException()
    {
        // Arrange
        var cmd = new CreateTransactionCommand
        {
            ProjectId = Guid.NewGuid(),
            Type = TransactionType.Expense,
            Description = "Test",
            Amount = 1000m
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
