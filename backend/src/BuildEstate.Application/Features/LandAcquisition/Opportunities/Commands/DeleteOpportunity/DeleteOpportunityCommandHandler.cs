using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Commands.DeleteOpportunity;

/// <summary>
/// Handles soft deletion of a land opportunity.
/// </summary>
public class DeleteOpportunityCommandHandler : IRequestHandler<DeleteOpportunityCommand, Unit>
{
    private readonly IRepository<LandOpportunity> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteOpportunityCommandHandler> _logger;

    public DeleteOpportunityCommandHandler(
        IRepository<LandOpportunity> repository,
        IUnitOfWork unitOfWork,
        ILogger<DeleteOpportunityCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(DeleteOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (entity is null)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.Id);
        }

        await _repository.DeleteAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Opportunity {OpportunityId} soft-deleted", request.Id);

        return Unit.Value;
    }
}
