using BuildEstate.Application.Features.Projects.Commands.ChangeProjectStatus;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
namespace BuildEstate.Application.Tests.Features.Projects;
public class ChangeProjectStatusCommandHandlerTests
{
    private readonly Mock<IRepository<Project>> _repoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<ChangeProjectStatusCommandHandler>> _loggerMock;
    private readonly ChangeProjectStatusCommandHandler _handler;
    public ChangeProjectStatusCommandHandlerTests()
    {
        _repoMock = new Mock<IRepository<Project>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ChangeProjectStatusCommandHandler>>();
        _handler = new ChangeProjectStatusCommandHandler(_repoMock.Object, _uowMock.Object, _loggerMock.Object);
    }
    [Fact]
    public async Task Handle_PlanningToPreConstruction_Succeeds()
    {
        var entity = new Project { Id = Guid.NewGuid(), Status = ProjectStatus.Planning };
        _repoMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);
        await _handler.Handle(new ChangeProjectStatusCommand(entity.Id, ProjectStatus.PreConstruction), CancellationToken.None);
        entity.Status.Should().Be(ProjectStatus.PreConstruction);
    }
    [Fact]
    public async Task Handle_InProgressToCompleted_SetsActualEndDate()
    {
        var entity = new Project { Id = Guid.NewGuid(), Status = ProjectStatus.InProgress };
        _repoMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);
        await _handler.Handle(new ChangeProjectStatusCommand(entity.Id, ProjectStatus.Completed), CancellationToken.None);
        entity.Status.Should().Be(ProjectStatus.Completed);
        entity.ActualEndDate.Should().NotBeNull();
    }
    [Fact]
    public async Task Handle_InvalidTransition_PlanningToCompleted_ThrowsBadRequest()
    {
        var entity = new Project { Id = Guid.NewGuid(), Status = ProjectStatus.Planning };
        _repoMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        var act = async () => await _handler.Handle(new ChangeProjectStatusCommand(entity.Id, ProjectStatus.Completed), CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>().WithMessage("*Cannot transition*");
    }
    [Fact]
    public async Task Handle_NotFound_ThrowsNotFoundException()
    {
        var id = Guid.NewGuid();
        _repoMock.Setup(x => x.GetByIdAsync(id, default)).ReturnsAsync((Project?)null);
        var act = async () => await _handler.Handle(new ChangeProjectStatusCommand(id, ProjectStatus.InProgress), CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
