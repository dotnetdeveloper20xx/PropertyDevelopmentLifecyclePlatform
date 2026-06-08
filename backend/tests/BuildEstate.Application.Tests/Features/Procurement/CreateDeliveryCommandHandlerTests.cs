using BuildEstate.Application.Features.Procurement.Commands.CreateDelivery;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Procurement;

public class CreateDeliveryCommandHandlerTests
{
    private readonly Mock<IRepository<PurchaseOrder>> _purchaseOrderRepoMock;
    private readonly Mock<IRepository<Delivery>> _deliveryRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateDeliveryCommandHandler>> _loggerMock;
    private readonly CreateDeliveryCommandHandler _handler;

    public CreateDeliveryCommandHandlerTests()
    {
        _purchaseOrderRepoMock = new Mock<IRepository<PurchaseOrder>>();
        _deliveryRepoMock = new Mock<IRepository<Delivery>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateDeliveryCommandHandler>>();
        _handler = new CreateDeliveryCommandHandler(
            _purchaseOrderRepoMock.Object, _deliveryRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsDeliveryDtoWithStatusPending()
    {
        // Arrange
        var cmd = new CreateDeliveryCommand
        {
            PurchaseOrderId = Guid.NewGuid(),
            DeliveryReference = "DEL/2024/001",
            DeliveryDate = new DateTime(2024, 7, 15),
            ReceivedBy = "Site Manager",
            Items = "500x Bricks, 100x Bags Cement",
            Notes = "Partial delivery"
        };
        _purchaseOrderRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PurchaseOrder, bool>>>(), default)).ReturnsAsync(true);
        _deliveryRepoMock.Setup(x => x.AddAsync(It.IsAny<Delivery>(), default)).ReturnsAsync((Delivery e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.DeliveryReference.Should().Be("DEL/2024/001");
        result.ReceivedBy.Should().Be("Site Manager");
        result.Status.Should().Be(DeliveryStatus.Pending);
        _deliveryRepoMock.Verify(x => x.AddAsync(It.IsAny<Delivery>(), default), Times.Once);
        _uowMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentPurchaseOrder_ThrowsNotFoundException()
    {
        // Arrange
        var cmd = new CreateDeliveryCommand
        {
            PurchaseOrderId = Guid.NewGuid(),
            DeliveryReference = "DEL/2024/002"
        };
        _purchaseOrderRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<PurchaseOrder, bool>>>(), default)).ReturnsAsync(false);

        // Act
        var act = async () => await _handler.Handle(cmd, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
