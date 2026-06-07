using BuildEstate.Application.Features.Finance.DTOs;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
namespace BuildEstate.Application.Features.Finance.Commands.CreateBudgetLine;
public class CreateBudgetLineCommandHandler : IRequestHandler<CreateBudgetLineCommand, BudgetLineDto>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<BudgetLine> _budgetLineRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateBudgetLineCommandHandler> _logger;
    public CreateBudgetLineCommandHandler(IRepository<Project> projectRepository, IRepository<BudgetLine> budgetLineRepository, IUnitOfWork unitOfWork, ILogger<CreateBudgetLineCommandHandler> logger)
    { _projectRepository = projectRepository; _budgetLineRepository = budgetLineRepository; _unitOfWork = unitOfWork; _logger = logger; }
    public async Task<BudgetLineDto> Handle(CreateBudgetLineCommand request, CancellationToken cancellationToken)
    {
        var projectExists = await _projectRepository.ExistsAsync(x => x.Id == request.ProjectId, cancellationToken);
        if (!projectExists) throw new NotFoundException(nameof(Project), request.ProjectId);
        var entity = new BudgetLine
        {
            ProjectId = request.ProjectId,
            Category = request.Category,
            Description = request.Description,
            PlannedAmount = request.PlannedAmount,
            ActualAmount = 0,
            Status = BudgetLineStatus.Planned,
            Notes = request.Notes
        };
        await _budgetLineRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("BudgetLine {BudgetLineId} '{Category}' created for project {ProjectId}", entity.Id, entity.Category, entity.ProjectId);
        return new BudgetLineDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            Category = entity.Category,
            Description = entity.Description,
            PlannedAmount = entity.PlannedAmount,
            ActualAmount = entity.ActualAmount,
            Status = entity.Status,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
