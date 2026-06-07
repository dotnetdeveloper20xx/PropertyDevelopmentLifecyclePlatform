using BuildEstate.Application.Features.Finance.DTOs;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Finance.Commands.CreateTransaction;
public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, FinancialTransactionDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<FinancialTransaction> _transactionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateTransactionCommandHandler> _logger;
    public CreateTransactionCommandHandler(IRepository<Project> projectRepository, IRepository<FinancialTransaction> transactionRepository, IUnitOfWork unitOfWork, ILogger<CreateTransactionCommandHandler> logger)
    { _projectRepository = projectRepository; _transactionRepository = transactionRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<FinancialTransactionDto> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var entity = new FinancialTransaction
        {
            ProjectId = request.ProjectId,
            Type = request.Type,
            Description = request.Description,
            Amount = request.Amount,
            Currency = "GBP",
            TransactionDate = DateTime.UtcNow,
            Category = request.Category,
            Reference = request.Reference,
            Notes = request.Notes
        };
        await _transactionRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("FinancialTransaction {TransactionId} created for project {ProjectId}", entity.Id, entity.ProjectId);
        return new FinancialTransactionDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            Type = entity.Type,
            Description = entity.Description,
            Amount = entity.Amount,
            Currency = entity.Currency,
            TransactionDate = entity.TransactionDate,
            Category = entity.Category,
            Reference = entity.Reference,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
