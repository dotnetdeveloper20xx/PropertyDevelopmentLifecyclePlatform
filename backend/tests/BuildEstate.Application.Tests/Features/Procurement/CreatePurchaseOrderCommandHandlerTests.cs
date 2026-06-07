using BuildEstate.Application.Features.Procurement.Commands.CreatePurchaseOrder;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Procurement;

public class CreatePurchaseOrderCommandHandlerTests
{
    private readonly Mock<IRepository<Project>> _projectRepoMock;
    private readonly Mock<IRepository<PurchaseOrder>> _poRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreatePurchaseOrderCommandHandler>> _loggerMock;
    private readonly CreatePurchaseOrderCommandHandler _handler;

    public CreatePurchaseOrderCommandHandlerTests()
    {
        _projectRepoMock = new Mock<IRepository<Project>>();
        _poRepoMock = new Mock<IRepository<PurchaseOrder>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreatePurchaseOrderCommandHandler>>();
        _handler = new CreatePurchaseOrderCommandHandler(
            _projectRepoMock.Object, _poRepoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsPurchaseOrderDto()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.NewGuid(), OrderReference = "PO/2024/001",
            SupplierName = "Builder Supplies Ltd", TotalValue = 15000
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(true);
        _poRepoMock.Setup(x => x.AddAsync(It.IsAny<PurchaseOrder>(), default)).ReturnsAsync((PurchaseOrder e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(cmd, CancellationToken.None);

        result.Should().NotBeNull();
        result.OrderReference.Should().Be("PO/2024/001");
        result.Status.Should().Be(PurchaseOrderStatus.Draft);
    }

    [Fact]
    public async Task Handle_WithNonExistentProject_ThrowsNotFoundException()
    {
        var cmd = new CreatePurchaseOrderCommand
        {
            ProjectId = Guid.NewGuid(), OrderReference = "PO/001",
            SupplierName = "Test", TotalValue = 1000
        };
        _projectRepoMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<Project, bool>>>(), default)).ReturnsAsync(false);

        var act = async () => await _handler.Handle(cmd, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();
    }
}
