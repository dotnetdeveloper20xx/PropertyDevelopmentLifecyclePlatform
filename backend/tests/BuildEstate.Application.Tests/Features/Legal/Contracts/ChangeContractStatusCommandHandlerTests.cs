using BuildEstate.Application.Features.Legal.Contracts.Commands.ChangeContractStatus;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Legal.Contracts;

public class ChangeContractStatusCommandHandlerTests
{
    private readonly Mock<IRepository<Contract>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ChangeContractStatusCommandHandler>> _loggerMock;
    private readonly ChangeContractStatusCommandHandler _handler;

    public ChangeContractStatusCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<Contract>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ChangeContractStatusCommandHandler>>();
        _handler = new ChangeContractStatusCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_DraftToUnderReview_Succeeds()
    {
        var entity = new Contract { Id = Guid.NewGuid(), Status = ContractStatus.Draft };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        await _handler.Handle(new ChangeContractStatusCommand(entity.Id, ContractStatus.UnderReview), CancellationToken.None);

        entity.Status.Should().Be(ContractStatus.UnderReview);
    }

    [Fact]
    public async Task Handle_AwaitingSignatureToExchanged_SetsExchangeDate()
    {
        var entity = new Contract { Id = Guid.NewGuid(), Status = ContractStatus.AwaitingSignature };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        await _handler.Handle(new ChangeContractStatusCommand(entity.Id, ContractStatus.Exchanged), CancellationToken.None);

        entity.Status.Should().Be(ContractStatus.Exchanged);
        entity.ExchangeDate.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_ExchangedToCompleted_SetsCompletionDate()
    {
        var entity = new Contract { Id = Guid.NewGuid(), Status = ContractStatus.Exchanged };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        await _handler.Handle(new ChangeContractStatusCommand(entity.Id, ContractStatus.Completed), CancellationToken.None);

        entity.Status.Should().Be(ContractStatus.Completed);
        entity.CompletionDate.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_InvalidTransition_DraftToExchanged_ThrowsBadRequest()
    {
        var entity = new Contract { Id = Guid.NewGuid(), Status = ContractStatus.Draft };
        _repositoryMock.Setup(x => x.GetByIdAsync(entity.Id, default)).ReturnsAsync(entity);

        var act = async () => await _handler.Handle(
            new ChangeContractStatusCommand(entity.Id, ContractStatus.Exchanged), CancellationToken.None);

        await act.Should().ThrowAsync<BadRequestException>().WithMessage("*Cannot transition*");
    }

    [Fact]
    public async Task Handle_NonExistentContract_ThrowsNotFoundException()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(x => x.GetByIdAsync(id, default)).ReturnsAsync((Contract?)null);

        var act = async () => await _handler.Handle(
            new ChangeContractStatusCommand(id, ContractStatus.UnderReview), CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }
}
