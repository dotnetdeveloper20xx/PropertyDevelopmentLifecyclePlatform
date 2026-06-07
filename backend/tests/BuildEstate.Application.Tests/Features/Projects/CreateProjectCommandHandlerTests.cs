using BuildEstate.Application.Features.Projects.Commands.CreateProject;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
namespace BuildEstate.Application.Tests.Features.Projects;
public class CreateProjectCommandHandlerTests
{
    private readonly Mock<IRepository<LandOpportunity>> _opportunityMock;
    private readonly Mock<IRepository<Project>> _projectMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateProjectCommandHandler>> _loggerMock;
    private readonly CreateProjectCommandHandler _handler;
    public CreateProjectCommandHandlerTests()
    {
        _opportunityMock = new Mock<IRepository<LandOpportunity>>();
        _projectMock = new Mock<IRepository<Project>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateProjectCommandHandler>>();
        _handler = new CreateProjectCommandHandler(_opportunityMock.Object, _projectMock.Object, _uowMock.Object, _loggerMock.Object);
    }
    [Fact]
    public async Task Handle_WithValidData_ReturnsCreatedDto()
    {
        var command = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "Riverside Dev", ProjectReference = "PRJ/2024/001" };
        _opportunityMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _projectMock.Setup(x => x.AddAsync(It.IsAny<Project>(), default)).ReturnsAsync((Project e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);
        var result = await _handler.Handle(command, CancellationToken.None);
        result.Should().NotBeNull();
        result.ProjectReference.Should().Be("PRJ/2024/001");
        result.Status.Should().Be("Planning");
    }
    [Fact]
    public async Task Handle_WithNonExistentOpportunity_ThrowsNotFoundException()
    {
        var command = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "Test", ProjectReference = "PRJ/001" };
        _opportunityMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(false);
        var act = async () => await _handler.Handle(command, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();
    }
    [Fact]
    public async Task Handle_SetsStatusToPlanning()
    {
        var command = new CreateProjectCommand { OpportunityId = Guid.NewGuid(), Name = "Test", ProjectReference = "PRJ/002" };
        Project? captured = null;
        _opportunityMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _projectMock.Setup(x => x.AddAsync(It.IsAny<Project>(), default)).Callback<Project, CancellationToken>((e, _) => captured = e).ReturnsAsync((Project e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);
        await _handler.Handle(command, CancellationToken.None);
        captured!.Status.Should().Be(ProjectStatus.Planning);
    }
}
