using BuildEstate.Application.Features.Units.Commands.CreatePropertyUnit;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Units;

public class CreatePropertyUnitCommandHandlerTests
{
    private readonly Mock<IRepository<Project>> _projectRepoMock;
    private readonly Mock<IRepository<PropertyUnit>> _unitRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreatePropertyUnitCommandHandler>> _loggerMock;
    private readonly CreatePropertyUnitCommandHandler _handler;

    public CreatePropertyUnitCommandHandlerTests()
    {
        _projectRepoMock = new Mock<IRepository<Project>>();
        _unitRepoMock = new Mock<IRepository<PropertyUnit>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreatePropertyUnitCommandHandler>>();
        _handler = new CreatePropertyUnitCommandHandler(
            _projectRepoMock.Object, _unitRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsPropertyUnitDtoWithStatusNotReleased()
    {
        // Arrange
        var cmd = new CreatePropertyUnitCommand
        {
            ProjectId = Guid.NewGuid(),
            UnitReference = "UNIT-A-101",
            UnitType = "Apartment",
            Bedrooms = 2,
            FloorArea = 75.5m,
            Price = 350000m,
            Floor = "1st",
            Notes = "Corner unit"
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(true);
        _unitRepoMock.Setup(x => x.AddAsync(It.IsAny<PropertyUnit>(), default)).ReturnsAsync((PropertyUnit e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.UnitReference.Should().Be("UNIT-A-101");
        result.UnitType.Should().Be("Apartment");
        result.Bedrooms.Should().Be(2);
        result.Status.Should().Be(UnitStatus.NotReleased);
        _unitRepoMock.Verify(x => x.AddAsync(It.IsAny<PropertyUnit>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentProject_ThrowsNotFoundException()
    {
        // Arrange
        var cmd = new CreatePropertyUnitCommand
        {
            ProjectId = Guid.NewGuid(),
            UnitReference = "UNIT-B-201"
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
