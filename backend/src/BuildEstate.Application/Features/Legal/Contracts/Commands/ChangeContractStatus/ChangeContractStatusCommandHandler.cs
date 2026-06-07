using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Legal.Contracts.Commands.ChangeContractStatus;

public class ChangeContractStatusCommandHandler : IRequestHandler<ChangeContractStatusCommand>
{
    private static readonly Dictionary<ContractStatus, ContractStatus[]> ValidTransitions = new()
    {
        [ContractStatus.Draft] = [ContractStatus.UnderReview, ContractStatus.Terminated],
        [ContractStatus.UnderReview] = [ContractStatus.AwaitingSignature, ContractStatus.Draft, ContractStatus.Terminated],
        [ContractStatus.AwaitingSignature] = [ContractStatus.Exchanged, ContractStatus.Terminated],
        [ContractStatus.Exchanged] = [ContractStatus.Completed, ContractStatus.Terminated],
        [ContractStatus.Completed] = [],
        [ContractStatus.Terminated] = [],
        [ContractStatus.Expired] = []
    };

    private readonly IRepository<Contract> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeContractStatusCommandHandler> _logger;

    public ChangeContractStatusCommandHandler(
        IRepository<Contract> repository,
        IUnitOfWork unitOfWork,
        ILogger<ChangeContractStatusCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Handle(ChangeContractStatusCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Contract), request.Id);

        var currentStatus = entity.Status;
        var newStatus = request.NewStatus;

        if (!ValidTransitions.TryGetValue(currentStatus, out var allowed) || !allowed.Contains(newStatus))
        {
            throw new BadRequestException(
                $"Cannot transition contract from '{currentStatus}' to '{newStatus}'. " +
                $"Valid transitions from '{currentStatus}': {string.Join(", ", allowed ?? [])}.");
        }

        entity.Status = newStatus;

        if (newStatus == ContractStatus.Exchanged && !entity.ExchangeDate.HasValue)
            entity.ExchangeDate = DateTime.UtcNow;
        else if (newStatus == ContractStatus.Completed && !entity.CompletionDate.HasValue)
            entity.CompletionDate = DateTime.UtcNow;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Contract {ContractId} status changed from {OldStatus} to {NewStatus}",
            entity.Id, currentStatus, newStatus);
    }
}
