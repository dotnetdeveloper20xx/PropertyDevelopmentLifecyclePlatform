using BuildEstate.Application.Features.LandAcquisition.Offers.Commands.ChangeOfferStatus;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.LandAcquisition.Offers;

public class ChangeOfferStatusCommandHandlerTests
{
    private readonly Mock<IRepository<Offer>> _offerRepoMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ChangeOfferStatusCommandHandler>> _loggerMock;
    private readonly ChangeOfferStatusCommandHandler _handler;

    public ChangeOfferStatusCommandHandlerTests()
    {
        _offerRepoMock = new Mock<IRepository<Offer>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ChangeOfferStatusCommandHandler>>();
        _handler = new ChangeOfferStatusCommandHandler(_offerRepoMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_AcceptOffer_ChangesStatusToAccepted()
    {
        // Arrange
        var oppId = Guid.NewGuid();
        var offer = new Offer { Id = Guid.NewGuid(), OpportunityId = oppId, Amount = 1000000, Status = OfferStatus.UnderReview };
        var command = new ChangeOfferStatusCommand { Id = offer.Id, OpportunityId = oppId, NewStatus = OfferStatus.Accepted };
        _offerRepoMock.Setup(x => x.GetByIdAsync(offer.Id, default)).ReturnsAsync(offer);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Status.Should().Be(OfferStatus.Accepted);
        _offerRepoMock.Verify(x => x.UpdateAsync(It.Is<Offer>(o => o.Status == OfferStatus.Accepted), default), Times.Once);
    }

    [Fact]
    public async Task Handle_RejectOffer_ChangesStatusToRejected()
    {
        var oppId = Guid.NewGuid();
        var offer = new Offer { Id = Guid.NewGuid(), OpportunityId = oppId, Amount = 500000, Status = OfferStatus.UnderReview };
        var command = new ChangeOfferStatusCommand { Id = offer.Id, OpportunityId = oppId, NewStatus = OfferStatus.Rejected };
        _offerRepoMock.Setup(x => x.GetByIdAsync(offer.Id, default)).ReturnsAsync(offer);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(command, CancellationToken.None);
        result.Status.Should().Be(OfferStatus.Rejected);
    }

    [Fact]
    public async Task Handle_CounterOffer_SetsCounterAmount()
    {
        var oppId = Guid.NewGuid();
        var offer = new Offer { Id = Guid.NewGuid(), OpportunityId = oppId, Amount = 1000000, Status = OfferStatus.UnderReview };
        var command = new ChangeOfferStatusCommand { Id = offer.Id, OpportunityId = oppId, NewStatus = OfferStatus.CounterOffered, CounterOfferAmount = 1200000 };
        _offerRepoMock.Setup(x => x.GetByIdAsync(offer.Id, default)).ReturnsAsync(offer);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(command, CancellationToken.None);
        result.Status.Should().Be(OfferStatus.CounterOffered);
        result.CounterOfferAmount.Should().Be(1200000);
    }

    [Fact]
    public async Task Handle_InvalidTransition_ThrowsBadRequestException()
    {
        var oppId = Guid.NewGuid();
        var offer = new Offer { Id = Guid.NewGuid(), OpportunityId = oppId, Amount = 1000000, Status = OfferStatus.Accepted };
        var command = new ChangeOfferStatusCommand { Id = offer.Id, OpportunityId = oppId, NewStatus = OfferStatus.Rejected };
        _offerRepoMock.Setup(x => x.GetByIdAsync(offer.Id, default)).ReturnsAsync(offer);

        await _handler.Invoking(h => h.Handle(command, CancellationToken.None))
            .Should().ThrowAsync<BadRequestException>();
    }

    [Fact]
    public async Task Handle_OfferNotFound_ThrowsNotFoundException()
    {
        var command = new ChangeOfferStatusCommand { Id = Guid.NewGuid(), OpportunityId = Guid.NewGuid(), NewStatus = OfferStatus.Accepted };
        _offerRepoMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Offer?)null);

        await _handler.Invoking(h => h.Handle(command, CancellationToken.None))
            .Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_OfferBelongsToDifferentOpportunity_ThrowsBadRequestException()
    {
        var offer = new Offer { Id = Guid.NewGuid(), OpportunityId = Guid.NewGuid(), Amount = 500000, Status = OfferStatus.UnderReview };
        var command = new ChangeOfferStatusCommand { Id = offer.Id, OpportunityId = Guid.NewGuid(), NewStatus = OfferStatus.Accepted };
        _offerRepoMock.Setup(x => x.GetByIdAsync(offer.Id, default)).ReturnsAsync(offer);

        await _handler.Invoking(h => h.Handle(command, CancellationToken.None))
            .Should().ThrowAsync<BadRequestException>();
    }
}
