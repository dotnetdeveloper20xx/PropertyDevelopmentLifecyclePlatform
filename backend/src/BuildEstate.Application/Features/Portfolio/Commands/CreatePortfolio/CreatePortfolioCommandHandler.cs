using BuildEstate.Application.Features.Portfolio.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Portfolio.Commands.CreatePortfolio;

using PortfolioEntity = Domain.Entities.Portfolio.Portfolio;

public class CreatePortfolioCommandHandler : IRequestHandler<CreatePortfolioCommand, PortfolioDto>
{
    private readonly IRepository<PortfolioEntity> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreatePortfolioCommandHandler> _logger;

    public CreatePortfolioCommandHandler(
        IRepository<PortfolioEntity> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreatePortfolioCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PortfolioDto> Handle(CreatePortfolioCommand request, CancellationToken cancellationToken)
    {
        var entity = new PortfolioEntity
        {
            Name = request.Name,
            Description = request.Description,
            Region = request.Region,
            TargetUnits = request.TargetUnits,
            TargetInvestment = request.TargetInvestment,
            TargetProfit = request.TargetProfit,
            RiskLevel = request.RiskLevel,
            Status = PortfolioStatus.Active,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Portfolio {PortfolioId} '{Name}' created successfully", entity.Id, entity.Name);

        return new PortfolioDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Region = entity.Region,
            TargetUnits = entity.TargetUnits,
            TargetInvestment = entity.TargetInvestment,
            TargetProfit = entity.TargetProfit,
            RiskLevel = entity.RiskLevel,
            Status = entity.Status,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
