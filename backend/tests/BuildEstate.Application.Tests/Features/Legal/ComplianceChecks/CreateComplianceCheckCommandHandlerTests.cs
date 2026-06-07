using BuildEstate.Application.Features.Legal.ComplianceChecks.Commands.CreateComplianceCheck;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Legal.ComplianceChecks;

public class CreateComplianceCheckCommandHandlerTests
{
    private readonly Mock<IRepository<LandOpportunity>> _opportunityRepositoryMock;
    private readonly Mock<IRepository<ComplianceCheck>> _complianceRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreateComplianceCheckCommandHandler>> _loggerMock;
    private readonly CreateComplianceCheckCommandHandler _handler;

    public CreateComplianceCheckCommandHandlerTests()
    {
        _opportunityRepositoryMock = new Mock<IRepository<LandOpportunity>>();
        _complianceRepositoryMock = new Mock<IRepository<ComplianceCheck>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateComplianceCheckCommandHandler>>();
        _handler = new CreateComplianceCheckCommandHandler(
            _opportunityRepositoryMock.Object, _complianceRepositoryMock.Object,
            _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsDto()
    {
        var command = new CreateComplianceCheckCommand
        {
            OpportunityId = Guid.NewGuid(),
            CheckType = ComplianceCheckType.AML,
            AssignedTo = "Jane Smith"
        };
        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(true);
        _complianceRepositoryMock.Setup(x => x.AddAsync(It.IsAny<ComplianceCheck>(), default)).ReturnsAsync((ComplianceCheck e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.CheckType.Should().Be(ComplianceCheckType.AML);
        result.Status.Should().Be(ComplianceCheckStatus.NotStarted);
    }

    [Fact]
    public async Task Handle_WithNonExistentOpportunity_ThrowsNotFoundException()
    {
        var command = new CreateComplianceCheckCommand
        {
            OpportunityId = Guid.NewGuid(), CheckType = ComplianceCheckType.KYC
        };
        _opportunityRepositoryMock.Setup(x => x.ExistsAsync(It.IsAny<System.Linq.Expressions.Expression<Func<LandOpportunity, bool>>>(), default)).ReturnsAsync(false);

        var act = async () => await _handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }
}
