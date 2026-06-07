using BuildEstate.Application.Features.Legal.Tasks.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Tasks.Commands.CreateLegalTask;

public record CreateLegalTaskCommand : IRequest<LegalTaskDto>
{
    public Guid? ContractId { get; init; }
    public Guid? OpportunityId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public LegalTaskPriority Priority { get; init; } = LegalTaskPriority.Medium;
    public string? AssignedTo { get; init; }
    public DateTime? DueDate { get; init; }
    public string? Notes { get; init; }
}
