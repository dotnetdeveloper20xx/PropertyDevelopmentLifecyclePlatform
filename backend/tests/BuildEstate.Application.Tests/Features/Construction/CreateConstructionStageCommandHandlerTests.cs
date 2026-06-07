using BuildEstate.Application.Features.Construction.Commands.CreateConstructionStage;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using MockQueryable;
using Moq;

namespace BuildEstate.Application.Tests.Features.Construction;

public class CreateConstructionStageCommandHandlerTests
{
    private readonly Mock<IRepository<Project>> _projectRepoMock;
    private readonly Mock<IRepository<ConstructionStage>> _stageRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateConstructionStageCommandHandler>> _loggerMock;
    private readonly CreateConstructionStageCommandHandler _handler;

    public CreateConstructionStageCommandHandlerTests()
    {
        _projectRepoMock = new Mock<IRepository<Project>>();
        _stageRepoMock = new Mock<IRepository<ConstructionStage>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateConstructionStageCommandHandler>>();
        _handler = new CreateConstructionStageCommandHandler(
            _projectRepoMock.Object, _stageRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsStageDto()
    {
        // Arrange
        var command = new CreateConstructionStageCommand
        {
            ProjectId = Guid.NewGuid(),
            Name = "Foundations"
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(true);
        var emptyList = new List<ConstructionStage>().AsQueryable().BuildMock();
        _stageRepoMock.Setup(x => x.Query()).Returns(emptyList);
        _stageRepoMock.Setup(x => x.AddAsync(It.IsAny<ConstructionStage>(), default))
            .ReturnsAsync((ConstructionStage e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Foundations");
        result.Status.Should().Be(ConstructionStageStatus.NotStarted);
        result.SortOrder.Should().Be(1);
    }

    [Fact]
    public async Task Handle_WithNonExistentProject_ThrowsNotFoundException()
    {
        // Arrange
        var command = new CreateConstructionStageCommand { ProjectId = Guid.NewGuid(), Name = "Test" };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_AutoIncrementsSortOrder()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var command = new CreateConstructionStageCommand { ProjectId = projectId, Name = "Superstructure" };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(true);

        var existing = new List<ConstructionStage>
        {
            new() { ProjectId = projectId, SortOrder = 1 },
            new() { ProjectId = projectId, SortOrder = 2 }
        }.AsQueryable().BuildMock();
        _stageRepoMock.Setup(x => x.Query()).Returns(existing);
        _stageRepoMock.Setup(x => x.AddAsync(It.IsAny<ConstructionStage>(), default))
            .ReturnsAsync((ConstructionStage e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.SortOrder.Should().Be(3);
    }
}
