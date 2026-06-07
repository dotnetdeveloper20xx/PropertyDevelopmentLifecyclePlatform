using BuildEstate.Application.Features.Investors.DTOs;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Investors.Commands.CreateInvestor;
public class CreateInvestorCommandHandler : IRequestHandler<CreateInvestorCommand, InvestorDto>
{
    private readonly IRepository<Investor> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateInvestorCommandHandler> _logger;
    public CreateInvestorCommandHandler(IRepository<Investor> repository, IUnitOfWork unitOfWork, ILogger<CreateInvestorCommandHandler> logger)
    { _repository = repository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<InvestorDto> Handle(CreateInvestorCommand request, CancellationToken cancellationToken)
    {
        var entity = new Investor
        {
            Name = request.Name,
            Type = request.Type,
            ContactName = request.ContactName,
            Email = request.Email,
            Phone = request.Phone,
            TotalCommitted = 0,
            TotalDeployed = 0,
            Notes = request.Notes
        };
        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Investor {InvestorId} '{Name}' created", entity.Id, entity.Name);
        return new InvestorDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Type = entity.Type,
            ContactName = entity.ContactName,
            Email = entity.Email,
            Phone = entity.Phone,
            TotalCommitted = entity.TotalCommitted,
            TotalDeployed = entity.TotalDeployed,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
