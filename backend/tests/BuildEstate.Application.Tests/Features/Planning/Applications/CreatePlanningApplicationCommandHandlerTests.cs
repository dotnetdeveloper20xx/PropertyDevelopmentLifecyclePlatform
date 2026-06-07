using BuildEstate.Application.Features.Planning.Applications.Commands.CreatePlanningApplication;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Planning.Applications;

public class CreatePlanningApplicationCommandHandlerTests
{
    private readonly Mock<IRepository<LandOpportunity>> _opportunityRepositoryMock;
    private readonly Mock<IRepository<PlanningApplication>> _planningRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreatePlanningApplicationCommandHandler>> _loggerMock;
    private readonly CreatePlanningApplicationCommandHandler _handler;

    public CreatePlanningApplicationCommandHandlerTests()
    {
        _opportunityRepositoryMock = new Mock<IRepository<LandOpportunity>>();
        _planningRepositoryMock = new Mock<IRepository<PlanningApplication>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreatePlanningApplicationCommandHandler>>();
        _handler = new CreatePlanningApplicationCommandHandler(
            _opportunityRepositoryMock.Object,
            _planningRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsCreatedDto()
    {
        // Arrange
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/001",
            Description = "Full planning for 50 dwellings",
            LocalAuthority = "Westminster Council",
            ApplicationType = "Full Planning"
        };

        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default))
            .ReturnsAsync(true);
        _planningRepositoryMock.Setup(x => x.AddAsync(It.IsAny<PlanningApplication>(), default))
            .ReturnsAsync((PlanningApplication entity, CancellationToken _) => entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.ApplicationReference.Should().Be("PA/2024/001");
        result.Status.Should().Be("PreApplication");
        result.Id.Should().NotBeEmpty();
        _planningRepositoryMock.Verify(x => x.AddAsync(It.IsAny<PlanningApplication>(), default), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithSubmissionDate_SetsStatusToSubmitted()
    {
        // Arrange
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/002",
            Description = "Outline planning",
            LocalAuthority = "Camden Council",
            ApplicationType = "Outline",
            SubmissionDate = DateTime.UtcNow
        };

        PlanningApplication? captured = null;
        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default))
            .ReturnsAsync(true);
        _planningRepositoryMock.Setup(x => x.AddAsync(It.IsAny<PlanningApplication>(), default))
            .Callback<PlanningApplication, CancellationToken>((e, _) => captured = e)
            .ReturnsAsync((PlanningApplication entity, CancellationToken _) => entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Status.Should().Be("Submitted");
        captured.Should().NotBeNull();
        captured!.Status.Should().Be(PlanningApplicationStatus.Submitted);
    }

    [Fact]
    public async Task Handle_WithNonExistentOpportunity_ThrowsNotFoundException()
    {
        // Arrange
        var command = new CreatePlanningApplicationCommand
        {
            OpportunityId = Guid.NewGuid(),
            ApplicationReference = "PA/2024/003",
            Description = "Test",
            LocalAuthority = "Test Council",
            ApplicationType = "Full Planning"
        };

        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default))
            .ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
