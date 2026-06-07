using BuildEstate.Application.Features.Planning.Appeals.Commands.CreatePlanningAppeal;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Planning.Appeals;

public class CreatePlanningAppealCommandHandlerTests
{
    private readonly Mock<IRepository<PlanningApplication>> _applicationRepositoryMock;
    private readonly Mock<IRepository<PlanningAppeal>> _appealRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreatePlanningAppealCommandHandler>> _loggerMock;
    private readonly CreatePlanningAppealCommandHandler _handler;

    public CreatePlanningAppealCommandHandlerTests()
    {
        _applicationRepositoryMock = new Mock<IRepository<PlanningApplication>>();
        _appealRepositoryMock = new Mock<IRepository<PlanningAppeal>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreatePlanningAppealCommandHandler>>();
        _handler = new CreatePlanningAppealCommandHandler(
            _applicationRepositoryMock.Object,
            _appealRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithRefusedApplication_CreatesAppealSuccessfully()
    {
        // Arrange
        var application = new PlanningApplication
        {
            Id = Guid.NewGuid(),
            Status = PlanningApplicationStatus.Refused
        };
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = application.Id,
            AppealReference = "APP/2024/001",
            Grounds = "The council failed to consider material planning considerations"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(application.Id, default)).ReturnsAsync(application);
        _appealRepositoryMock.Setup(x => x.AddAsync(It.IsAny<PlanningAppeal>(), default))
            .ReturnsAsync((PlanningAppeal e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.AppealReference.Should().Be("APP/2024/001");
        result.Status.Should().Be(AppealStatus.Submitted);
        application.Status.Should().Be(PlanningApplicationStatus.Appeal);
    }

    [Fact]
    public async Task Handle_WithNonRefusedApplication_ThrowsBadRequest()
    {
        // Arrange
        var application = new PlanningApplication
        {
            Id = Guid.NewGuid(),
            Status = PlanningApplicationStatus.UnderReview
        };
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = application.Id,
            AppealReference = "APP/2024/002",
            Grounds = "Test"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(application.Id, default)).ReturnsAsync(application);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<BadRequestException>()
            .WithMessage("*refused*");
    }

    [Fact]
    public async Task Handle_WithNonExistentApplication_ThrowsNotFoundException()
    {
        // Arrange
        var command = new CreatePlanningAppealCommand
        {
            PlanningApplicationId = Guid.NewGuid(),
            AppealReference = "APP/2024/003",
            Grounds = "Test"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(command.PlanningApplicationId, default))
            .ReturnsAsync((PlanningApplication?)null);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
