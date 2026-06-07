using BuildEstate.Application.Features.Legal.Tasks.Commands.CreateLegalTask;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace BuildEstate.Application.Tests.Features.Legal.Tasks;

public class CreateLegalTaskCommandHandlerTests
{
    private readonly Mock<IRepository<LegalTask>> _repositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<CreateLegalTaskCommandHandler>> _loggerMock;
    private readonly CreateLegalTaskCommandHandler _handler;

    public CreateLegalTaskCommandHandlerTests()
    {
        _repositoryMock = new Mock<IRepository<LegalTask>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<CreateLegalTaskCommandHandler>>();
        _handler = new CreateLegalTaskCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_WithValidData_ReturnsTaskDto()
    {
        var command = new CreateLegalTaskCommand
        {
            Title = "Submit Land Registry Application",
            Priority = LegalTaskPriority.High,
            AssignedTo = "John"
        };
        _repositoryMock.Setup(x => x.AddAsync(It.IsAny<LegalTask>(), default)).ReturnsAsync((LegalTask e, CancellationToken _) => e);
        _unitOfWorkMock.Setup(x => x.SaveChangesAsync(default)).ReturnsAsync(1);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result.Title.Should().Be("Submit Land Registry Application");
        result.Priority.Should().Be(LegalTaskPriority.High);
        result.Status.Should().Be(LegalTaskStatus.Open);
    }
}
