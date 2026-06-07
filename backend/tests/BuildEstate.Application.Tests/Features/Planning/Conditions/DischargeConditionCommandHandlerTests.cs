using BuildEstate.Application.Features.Planning.Conditions.Commands.DischargeCondition;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Planning.Conditions;

public class DischargeConditionCommandHandlerTests
{
    private readonly Mock<IRepository<PlanningCondition>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<DischargeConditionCommandHandler>> _loggerMock;
    private readonly DischargeConditionCommandHandler _handler;

    public DischargeConditionCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<PlanningCondition>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<DischargeConditionCommandHandler>>();
        _handler = new DischargeConditionCommandHandler(
            _repositoryMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_FullDischarge_SetsStatusToDischarged()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var entity = new PlanningCondition
        {
            Id = Guid.NewGuid(),
            PlanningApplicationId = applicationId,
            Status = PlanningConditionStatus.Pending
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new DischargeConditionCommand
        {
            Id = entity.Id,
            PlanningApplicationId = applicationId,
            PartialDischarge = false,
            DischargeReference = "DC/2024/001"
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Status.Should().Be(PlanningConditionStatus.Discharged);
        result.DischargeDate.Should().NotBeNull();
        result.DischargeReference.Should().Be("DC/2024/001");
    }

    [Fact]
    public async Task Handle_PartialDischarge_SetsStatusToPartiallyDischarged()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var entity = new PlanningCondition
        {
            Id = Guid.NewGuid(),
            PlanningApplicationId = applicationId,
            Status = PlanningConditionStatus.Submitted
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var command = new DischargeConditionCommand
        {
            Id = entity.Id,
            PlanningApplicationId = applicationId,
            PartialDischarge = true
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Status.Should().Be(PlanningConditionStatus.PartiallyDischarged);
    }

    [Fact]
    public async Task Handle_AlreadyDischarged_ThrowsBadRequest()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var entity = new PlanningCondition
        {
            Id = Guid.NewGuid(),
            PlanningApplicationId = applicationId,
            Status = PlanningConditionStatus.Discharged
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);

        var command = new DischargeConditionCommand
        {
            Id = entity.Id,
            PlanningApplicationId = applicationId,
            PartialDischarge = false
        };

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<BadRequestException>()
            .WithMessage("*already been fully discharged*");
    }

    [Fact]
    public async Task Handle_WrongApplication_ThrowsBadRequest()
    {
        // Arrange
        var entity = new PlanningCondition
        {
            Id = Guid.NewGuid(),
            PlanningApplicationId = Guid.NewGuid(),
            Status = PlanningConditionStatus.Pending
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);

        var command = new DischargeConditionCommand
        {
            Id = entity.Id,
            PlanningApplicationId = Guid.NewGuid(), // Different from entity's
            PartialDischarge = false
        };

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<BadRequestException>();
    }
}
