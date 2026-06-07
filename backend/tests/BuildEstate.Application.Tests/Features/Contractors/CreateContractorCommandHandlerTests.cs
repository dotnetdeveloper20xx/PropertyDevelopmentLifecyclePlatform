using BuildEstate.Application.Features.Contractors.Commands.CreateContractor;
using BuildEstate.Domain.Entities.Contractors;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Contractors;

public class CreateContractorCommandHandlerTests
{
    private readonly Mock<IRepository<Contractor>> _repoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<ILogger<CreateContractorCommandHandler>> _loggerMock;
    private readonly CreateContractorCommandHandler _handler;

    public CreateContractorCommandHandlerTests()
    {
        _repoMock = new Mock<IRepository<Contractor>>();
        _uowMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateContractorCommandHandler>>();
        _handler = new CreateContractorCommandHandler(_repoMock.Object, _uowMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsContractorDto()
    {
        var cmd = new CreateContractorCommand
        {
            CompanyName = "Elite Builders", Type = ContractorType.MainContractor, Trade = "General Build"
        };
        _repoMock.Setup(x => x.AddAsync(It.IsAny<Contractor>(), default)).ReturnsAsync((Contractor e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(cmd, CancellationToken.None);

        result.Should().NotBeNull();
        result.CompanyName.Should().Be("Elite Builders");
        result.Status.Should().Be(ContractorStatus.Active);
        result.Type.Should().Be(ContractorType.MainContractor);
    }

    [Fact]
    public async Task Handle_SetsStatusToActive()
    {
        var cmd = new CreateContractorCommand { CompanyName = "Plumb Pro", Type = ContractorType.Subcontractor };
        Contractor? captured = null;
        _repoMock.Setup(x => x.AddAsync(It.IsAny<Contractor>(), default))
            .Callback<Contractor, CancellationToken>((e, _) => captured = e)
            .ReturnsAsync((Contractor e, CancellationToken _) => e);
        _uowMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        await _handler.Handle(cmd, CancellationToken.None);

        captured!.Status.Should().Be(ContractorStatus.Active);
    }
}
