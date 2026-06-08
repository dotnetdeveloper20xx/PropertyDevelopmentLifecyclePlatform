using BuildEstate.Application.Features.Rentals.Commands.CreateTenancy;
using BuildEstate.Domain.Entities.Rentals;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Rentals;

public class CreateTenancyCommandHandlerTests
{
    private readonly Mock<IRepository<PropertyUnit>> _unitRepoMock;
    private readonly Mock<IRepository<Tenancy>> _tenancyRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateTenancyCommandHandler>> _loggerMock;
    private readonly CreateTenancyCommandHandler _handler;

    public CreateTenancyCommandHandlerTests()
    {
        _unitRepoMock = new Mock<IRepository<PropertyUnit>>();
        _tenancyRepoMock = new Mock<IRepository<Tenancy>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateTenancyCommandHandler>>();
        _handler = new CreateTenancyCommandHandler(
            _unitRepoMock.Object, _tenancyRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsTenancyDtoWithStatusActive()
    {
        // Arrange
        var cmd = new CreateTenancyCommand
        {
            PropertyUnitId = Guid.NewGuid(),
            TenantName = "Alice Johnson",
            TenantEmail = "alice@example.com",
            TenantPhone = "07700 900456",
            MonthlyRent = 1500m,
            LeaseStartDate = new DateTime(2024, 6, 1),
            LeaseEndDate = new DateTime(2025, 5, 31),
            Notes = "12-month tenancy"
        };
        _unitRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PropertyUnit, bool>>>(), default)).ReturnsAsync(true);
        _tenancyRepoMock.Setup(x => x.AddAsync(It.IsAny<Tenancy>(), default)).ReturnsAsync((Tenancy e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.TenantName.Should().Be("Alice Johnson");
        result.MonthlyRent.Should().Be(1500m);
        result.Status.Should().Be(TenancyStatus.Active);
        _tenancyRepoMock.Verify(x => x.AddAsync(It.IsAny<Tenancy>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentUnit_ThrowsNotFoundException()
    {
        // Arrange
        var cmd = new CreateTenancyCommand
        {
            PropertyUnitId = Guid.NewGuid(),
            TenantName = "Bob Smith",
            MonthlyRent = 1200m,
            LeaseStartDate = DateTime.UtcNow,
            LeaseEndDate = DateTime.UtcNow.AddYears(1)
        };
        _unitRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PropertyUnit, bool>>>(), default)).ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
