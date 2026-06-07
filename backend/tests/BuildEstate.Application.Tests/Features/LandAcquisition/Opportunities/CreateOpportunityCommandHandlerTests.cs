using BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.CreateOpportunity;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.Opportunities;

public class CreateOpportunityCommandHandlerTests
{
    private readonly Mock<IRepository<LandOpportunity>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreateOpportunityCommandHandler>> _loggerMock;
    private readonly CreateOpportunityCommandHandler _handler;

    public CreateOpportunityCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<LandOpportunity>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateOpportunityCommandHandler>>();
        _handler = new CreateOpportunityCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsCreatedDto()
    {
        // Arrange
        var command = new CreateOpportunityCommand
        {
            Name = "Test Land Site",
            Location = "London",
            LandSize = 2.5m
        };

        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<LandOpportunity>(), default))
            .ReturnsAsync((LandOpportunity entity, CancellationToken _) => entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be("Test Land Site");
        result.Status.Should().Be("Identified");
        result.Id.Should().NotBeEmpty();
        _repositoryMock.Verify(x => x.AddAsync(It.IsAny<LandOpportunity>(), default), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_SetsStatusToIdentified()
    {
        // Arrange
        var command = new CreateOpportunityCommand { Name = "Site A", Location = "Manchester", LandSize = 1.0m };
        LandOpportunity? captured = null;
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<LandOpportunity>(), default))
            .Callback<LandOpportunity, CancellationToken>((e, _) => captured = e)
            .ReturnsAsync((LandOpportunity entity, CancellationToken _) => entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        captured.Should().NotBeNull();
        captured!.Status.Should().Be(OpportunityStatus.Identified);
    }

    [Fact]
    public async Task Handle_SetsOptionalFields_WhenProvided()
    {
        // Arrange
        var command = new CreateOpportunityCommand
        {
            Name = "Premium Land", Location = "Birmingham", LandSize = 5.0m,
            AskingPrice = 2500000, Source = "Agent", AgentName = "Smith & Co"
        };
        LandOpportunity? captured = null;
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<LandOpportunity>(), default))
            .Callback<LandOpportunity, CancellationToken>((e, _) => captured = e)
            .ReturnsAsync((LandOpportunity entity, CancellationToken _) => entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        captured!.AskingPrice.Should().Be(2500000);
        captured.Source.Should().Be("Agent");
        captured.AgentName.Should().Be("Smith & Co");
    }
}
