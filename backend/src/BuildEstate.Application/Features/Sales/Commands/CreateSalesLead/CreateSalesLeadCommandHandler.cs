using BuildEstate.Application.Features.Sales.DTOs;
using BuildEstate.Domain.Entities.Sales;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Sales.Commands.CreateSalesLead;
public class CreateSalesLeadCommandHandler : IRequestHandler<CreateSalesLeadCommand, SalesLeadDto>
{
    private readonly IRepository<SalesLead> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateSalesLeadCommandHandler> _logger;
    public CreateSalesLeadCommandHandler(IRepository<SalesLead> repository, IUnitOfWork unitOfWork, ILogger<CreateSalesLeadCommandHandler> logger)
    { _repository = repository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<SalesLeadDto> Handle(CreateSalesLeadCommand request, CancellationToken cancellationToken)
    {
        var entity = new SalesLead
        {
            ProjectId = request.ProjectId,
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Source = request.Source,
            Status = LeadStatus.New,
            InterestDetails = request.InterestDetails,
            Budget = request.Budget,
            Notes = request.Notes
        };
        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("SalesLead {LeadId} '{Name}' created", entity.Id, entity.Name);
        return new SalesLeadDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            Name = entity.Name,
            Email = entity.Email,
            Phone = entity.Phone,
            Source = entity.Source,
            Status = entity.Status,
            InterestDetails = entity.InterestDetails,
            Budget = entity.Budget,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
