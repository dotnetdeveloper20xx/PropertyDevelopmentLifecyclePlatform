using BuildEstate.Application.Features.LandAcquisition.DueDiligences.Commands.CreateDueDiligence;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Linq.Expressions;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.DueDiligences;

public class CreateDueDiligenceCommandHandlerTests
{
    private readonly Mock<IRepository<LandOpportunity>> _opportunityRepoMock;
    private readonly Mock<IRepository<DueDiligence>> _ddRepoMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreateDueDiligenceCommandHandler>> _loggerMock;
    private readonly CreateDueDiligenceCommandHandler _handler;

    public CreateDueDiligenceCommandHandlerTests()
    {
        _opportunityRepoMock = new Mock<IRepository<LandOpportunity>>();
        _ddRepoMock = new Mock<IRepository<DueDiligence>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateDueDiligenceCommandHandler>>();
        _handler = new CreateDueDiligenceCommandHandler(
            _opportunityRepoMock.Object, _ddRepoMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsDueDiligenceDto()
    {
        // Arrange
        var oppId = Guid.NewGuid();
        var command = new CreateDueDiligenceCommand { OpportunityId = oppId, Type = DueDiligenceType.Legal, AssignedTo = "Smith & Co" };
        _opportunityRepoMock.Setup(x => x.ExistsAsync(It.IsAny<Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _ddRepoMock.Setup(x => x.AddAsync(It.IsAny<DueDiligence>(), default)).ReturnsAsync((DueDiligence e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.OpportunityId.Should().Be(oppId);
        result.Type.Should().Be(DueDiligenceType.Legal);
        result.Status.Should().Be(DueDiligenceStatus.Pending);
    }

    [Fact]
    public async Task Handle_WithNonExistentOpportunity_ThrowsNotFoundException()
    {
        // Arrange
        var command = new CreateDueDiligenceCommand { OpportunityId = Guid.NewGuid(), Type = DueDiligenceType.Environmental };
        _opportunityRepoMock.Setup(x => x.ExistsAsync(It.IsAny<Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(false);

        // Act & Assert
        await _handler.Invoking(h => h.Handle(command, CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_CreatesWithPendingStatus()
    {
        // Arrange
        var command = new CreateDueDiligenceCommand { OpportunityId = Guid.NewGuid(), Type = DueDiligenceType.Planning };
        DueDiligence? captured = null;
        _opportunityRepoMock.Setup(x => x.ExistsAsync(It.IsAny<Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _ddRepoMock.Setup(x => x.AddAsync(It.IsAny<DueDiligence>(), default))
            .Callback<DueDiligence, CancellationToken>((e, _) => captured = e)
            .ReturnsAsync((DueDiligence e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        captured!.Status.Should().Be(DueDiligenceStatus.Pending);
    }
}
