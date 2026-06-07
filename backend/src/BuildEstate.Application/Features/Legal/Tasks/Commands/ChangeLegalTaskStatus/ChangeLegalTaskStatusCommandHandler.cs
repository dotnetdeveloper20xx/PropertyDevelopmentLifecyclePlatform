using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Legal.Tasks.Commands.ChangeLegalTaskStatus;

public class ChangeLegalTaskStatusCommandHandler : IRequestHandler<ChangeLegalTaskStatusCommand>
{
    private readonly IRepository<LegalTask> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeLegalTaskStatusCommandHandler> _logger;

    public ChangeLegalTaskStatusCommandHandler(
        IRepository<LegalTask> repository,
        IUnitOfWork unitOfWork,
        ILogger<ChangeLegalTaskStatusCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChangeLegalTaskStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(LegalTask), request.Id);

        entity.Status = request.NewStatus;

        if (request.NewStatus == LegalTaskStatus.Completed)
            entity.CompletedDate ??= DateTime.UtcNow;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Legal task {TaskId} status changed to {NewStatus}", entity.Id, request.NewStatus);
    }
}
