using BuildEstate.Application.Features.Planning.Conditions.Commands.CreatePlanningCondition;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using MockQueryable;
using Moq;

namespace BuildEstate.Application.Tests.Features.Planning.Conditions;

public class CreatePlanningConditionCommandHandlerTests
{
    private readonly Mock<IRepository<PlanningApplication>> _applicationRepositoryMock;
    private readonly Mock<IRepository<PlanningCondition>> _conditionRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreatePlanningConditionCommandHandler>> _loggerMock;
    private readonly CreatePlanningConditionCommandHandler _handler;

    public CreatePlanningConditionCommandHandlerTests()
    {
        _applicationRepositoryMock = new Mock<IRepository<PlanningApplication>>();
        _conditionRepositoryMock = new Mock<IRepository<PlanningCondition>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreatePlanningConditionCommandHandler>>();
        _handler = new CreatePlanningConditionCommandHandler(
            _applicationRepositoryMock.Object,
            _conditionRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsConditionDto()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = applicationId,
            Title = "Landscaping Scheme",
            Description = "Submit details of hard and soft landscaping"
        };

        _applicationRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PlanningApplication, bool>>>(), default))
            .ReturnsAsync(true);

        var emptyList = new List<PlanningCondition>().AsQueryable().BuildMock();
        _conditionRepositoryMock.Setup(x => x.Query()).Returns(emptyList);
        _conditionRepositoryMock.Setup(x => x.AddAsync(It.IsAny<PlanningCondition>(), default))
            .ReturnsAsync((PlanningCondition e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Landscaping Scheme");
        result.ConditionNumber.Should().Be(1);
        result.Status.Should().Be(PlanningConditionStatus.Pending);
    }

    [Fact]
    public async Task Handle_WithNonExistentApplication_ThrowsNotFoundException()
    {
        // Arrange
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            Title = "Test",
            Description = "Test"
        };

        _applicationRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PlanningApplication, bool>>>(), default))
            .ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_AutoIncrementsConditionNumber()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var command = new CreatePlanningConditionCommand
        {
            PlanningApplicationId = applicationId,
            Title = "Access Road",
            Description = "Details of access road construction"
        };

        _applicationRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PlanningApplication, bool>>>(), default))
            .ReturnsAsync(true);

        var existingConditions = new List<PlanningCondition>
        {
            new() { PlanningApplicationId = applicationId, ConditionNumber = 1 },
            new() { PlanningApplicationId = applicationId, ConditionNumber = 2 }
        }.AsQueryable().BuildMock();

        _conditionRepositoryMock.Setup(x => x.Query()).Returns(existingConditions);
        _conditionRepositoryMock.Setup(x => x.AddAsync(It.IsAny<PlanningCondition>(), default))
            .ReturnsAsync((PlanningCondition e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.ConditionNumber.Should().Be(3);
    }
}
