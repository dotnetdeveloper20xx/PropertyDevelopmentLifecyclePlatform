using BuildEstate.Application.Features.Planning.Applications.Commands.ChangePlanningApplicationStatus;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Planning.Applications;

public class ChangePlanningApplicationStatusCommandHandlerTests
{
    private readonly Mock<IRepository<PlanningApplication>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ChangePlanningApplicationStatusCommandHandler>> _loggerMock;
    private readonly ChangePlanningApplicationStatusCommandHandler _handler;

    public ChangePlanningApplicationStatusCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<PlanningApplication>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ChangePlanningApplicationStatusCommandHandler>>();
        _handler = new ChangePlanningApplicationStatusCommandHandler(
            _repositoryMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_ValidTransition_PreApplicationToSubmitted_Succeeds()
    {
        // Arrange
        var entity = new PlanningApplication
        {
            Id = Guid.NewGuid(),
            Status = PlanningApplicationStatus.PreApplication
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _handler.Handle(
            new ChangePlanningApplicationStatusCommand(entity.Id, PlanningApplicationStatus.Submitted),
            CancellationToken.None);

        // Assert
        entity.Status.Should().Be(PlanningApplicationStatus.Submitted);
        entity.SubmissionDate.Should().NotBeNull();
        _repositoryMock.Verify(x => x.UpdateAsync(entity, default), Times.Once);
    }

    [Fact]
    public async Task Handle_ValidTransition_SubmittedToValidated_Succeeds()
    {
        // Arrange
        var entity = new PlanningApplication
        {
            Id = Guid.NewGuid(),
            Status = PlanningApplicationStatus.Submitted
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _handler.Handle(
            new ChangePlanningApplicationStatusCommand(entity.Id, PlanningApplicationStatus.Validated),
            CancellationToken.None);

        // Assert
        entity.Status.Should().Be(PlanningApplicationStatus.Validated);
        entity.ValidationDate.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_InvalidTransition_PreApplicationToApproved_ThrowsBadRequest()
    {
        // Arrange
        var entity = new PlanningApplication
        {
            Id = Guid.NewGuid(),
            Status = PlanningApplicationStatus.PreApplication
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);

        // Act
        var act = async () => await _handler.Handle(
            new ChangePlanningApplicationStatusCommand(entity.Id, PlanningApplicationStatus.Approved),
            CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<BadRequestException>()
            .WithMessage("*Cannot transition*");
    }

    [Fact]
    public async Task Handle_NonExistentApplication_ThrowsNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(x => x.GetByIdAsync(id, default)).ReturnsAsync((PlanningApplication?)null);

        // Act
        var act = async () => await _handler.Handle(
            new ChangePlanningApplicationStatusCommand(id, PlanningApplicationStatus.Submitted),
            CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_UnderReviewToRefused_SetsDecisionDate()
    {
        // Arrange
        var entity = new PlanningApplication
        {
            Id = Guid.NewGuid(),
            Status = PlanningApplicationStatus.UnderReview
        };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _handler.Handle(
            new ChangePlanningApplicationStatusCommand(entity.Id, PlanningApplicationStatus.Refused),
            CancellationToken.None);

        // Assert
        entity.Status.Should().Be(PlanningApplicationStatus.Refused);
        entity.DecisionDate.Should().NotBeNull();
    }
}
