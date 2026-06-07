using BuildEstate.Domain.Enums;

namespace BuildEstate.Application.Features.Legal.Tasks.DTOs;

public record LegalTaskDto
{
    public Guid Id { get; init; }
    public Guid? ContractId { get; init; }
    public Guid? OpportunityId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public LegalTaskPriority Priority { get; init; }
    public LegalTaskStatus Status { get; init; }
    public string? AssignedTo { get; init; }
    public DateTime? DueDate { get; init; }
    public DateTime? CompletedDate { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedAt { get; init; }
}
