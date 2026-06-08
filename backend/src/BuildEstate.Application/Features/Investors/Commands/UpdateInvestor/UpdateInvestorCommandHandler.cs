using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Investors.Commands.UpdateInvestor;

/// <summary>
/// Handles updating an existing investor.
/// Full PUT replacement — all fields are overwritten.
/// </summary>
public class UpdateInvestorCommandHandler : IRequestHandler<UpdateInvestorCommand, Unit>
{
    private readonly IRepository<Investor> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateInvestorCommandHandler> _logger;

    public UpdateInvestorCommandHandler(
        IRepository<Investor> repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateInvestorCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Unit> Handle(UpdateInvestorCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Investor), request.Id);

        entity.Name = request.Name;
        entity.Type = request.Type;
        entity.ContactName = request.ContactName;
        entity.Email = request.Email;
        entity.Phone = request.Phone;
        entity.TotalCommitted = request.TotalCommitted;
        entity.TotalDeployed = request.TotalDeployed;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Investor {InvestorId} updated", entity.Id);

        return Unit.Value;
    }
}
