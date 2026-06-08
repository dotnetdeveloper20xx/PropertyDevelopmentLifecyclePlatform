using BuildEstate.Application.Features.Finance.Commands.CreateBudgetLine;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Finance;

public class CreateBudgetLineCommandHandlerTests
{
    private readonly Mock<IRepository<Project>> _projectRepoMock;
    private readonly Mock<IRepository<BudgetLine>> _budgetLineRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateBudgetLineCommandHandler>> _loggerMock;
    private readonly CreateBudgetLineCommandHandler _handler;

    public CreateBudgetLineCommandHandlerTests()
    {
        _projectRepoMock = new Mock<IRepository<Project>>();
        _budgetLineRepoMock = new Mock<IRepository<BudgetLine>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateBudgetLineCommandHandler>>();
        _handler = new CreateBudgetLineCommandHandler(
            _projectRepoMock.Object, _budgetLineRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsBudgetLineDtoWithStatusPlanned()
    {
        // Arrange
        var cmd = new CreateBudgetLineCommand
        {
            ProjectId = Guid.NewGuid(),
            Category = "Materials",
            Description = "Brickwork supplies",
            PlannedAmount = 50000m,
            Notes = "Phase 1 budget"
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(true);
        _budgetLineRepoMock.Setup(x => x.AddAsync(It.IsAny<BudgetLine>(), default)).ReturnsAsync((BudgetLine e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Category.Should().Be("Materials");
        result.PlannedAmount.Should().Be(50000m);
        result.ActualAmount.Should().Be(0);
        result.Status.Should().Be(BudgetLineStatus.Planned);
        _budgetLineRepoMock.Verify(x => x.AddAsync(It.IsAny<BudgetLine>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentProject_ThrowsNotFoundException()
    {
        // Arrange
        var cmd = new CreateBudgetLineCommand
        {
            ProjectId = Guid.NewGuid(),
            Category = "Labour",
            PlannedAmount = 20000m
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
