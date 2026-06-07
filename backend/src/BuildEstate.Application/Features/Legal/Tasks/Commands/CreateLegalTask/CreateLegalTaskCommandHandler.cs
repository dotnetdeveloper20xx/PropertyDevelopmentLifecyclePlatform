using BuildEstate.Application.Features.Legal.Tasks.DTOs;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.Legal.Tasks.Commands.CreateLegalTask;

public class CreateLegalTaskCommandHandler : IRequestHandler<CreateLegalTaskCommand, LegalTaskDto>
{
    private readonly IRepository<LegalTask> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateLegalTaskCommandHandler> _logger;

    public CreateLegalTaskCommandHandler(
        IRepository<LegalTask> repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateLegalTaskCommandHandler> logger)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<LegalTaskDto> Handle(CreateLegalTaskCommand request, CancellationToken cancellationToken)
    {
        var entity = new LegalTask
        {
            ContractId = request.ContractId,
            OpportunityId = request.OpportunityId,
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            Status = LegalTaskStatus.Open,
            AssignedTo = request.AssignedTo,
            DueDate = request.DueDate,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Legal task {TaskId} '{Title}' created", entity.Id, entity.Title);

        return new LegalTaskDto
        {
            Id = entity.Id,
            ContractId = entity.ContractId,
            OpportunityId = entity.OpportunityId,
            Title = entity.Title,
            Description = entity.Description,
            Priority = entity.Priority,
            Status = entity.Status,
            AssignedTo = entity.AssignedTo,
            DueDate = entity.DueDate,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
    }
}
