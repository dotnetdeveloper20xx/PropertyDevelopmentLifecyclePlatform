using BuildEstate.Application.Features.Legal.Contracts.Commands.CreateContract;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Legal.Contracts;

public class CreateContractCommandHandlerTests
{
    private readonly Mock<IRepository<LandOpportunity>> _opportunityRepositoryMock;
    private readonly Mock<IRepository<Contract>> _contractRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreateContractCommandHandler>> _loggerMock;
    private readonly CreateContractCommandHandler _handler;

    public CreateContractCommandHandlerTests()
    {
        _opportunityRepositoryMock = new Mock<IRepository<LandOpportunity>>();
        _contractRepositoryMock = new Mock<IRepository<Contract>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateContractCommandHandler>>();
        _handler = new CreateContractCommandHandler(
            _opportunityRepositoryMock.Object, _contractRepositoryMock.Object,
            _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsCreatedDto()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(),
            Title = "Sale & Purchase Agreement",
            ContractType = ContractType.SaleAndPurchase,
            ContractReference = "CON/2024/001",
            CounterpartyName = "Land Owner Ltd"
        };
        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _contractRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Contract>(), default)).ReturnsAsync((Contract e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.ContractReference.Should().Be("CON/2024/001");
        result.Status.Should().Be("Draft");
    }

    [Fact]
    public async Task Handle_WithNonExistentOpportunity_ThrowsNotFoundException()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(),
            Title = "Test", ContractType = ContractType.Lease,
            ContractReference = "CON/2024/002", CounterpartyName = "Test Ltd"
        };
        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(false);

        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Handle_SetsStatusToDraft()
    {
        var command = new CreateContractCommand
        {
            OpportunityId = Guid.NewGuid(),
            Title = "Option Agreement", ContractType = ContractType.OptionAgreement,
            ContractReference = "CON/2024/003", CounterpartyName = "Seller Corp"
        };
        Contract? captured = null;
        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _contractRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Contract>(), default))
            .Callback<Contract, CancellationToken>((e, _) => captured = e)
            .ReturnsAsync((Contract e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        await _handler.Handle(command, CancellationToken.None);

        captured.Should().NotBeNull();
        captured!.Status.Should().Be(ContractStatus.Draft);
    }
}
