using BuildEstate.Application.Features.Legal.Tasks.DTOs;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;

namespace BuildEstate.Application.Features.Legal.Tasks.Queries.GetLegalTasks;

public record GetLegalTasksQuery : IRequest<ApiResponse<List<LegalTaskDto>>>
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }
    public LegalTaskStatus? Status { get; init; }
    public LegalTaskPriority? Priority { get; init; }
    public Guid? ContractId { get; init; }
    public Guid? OpportunityId { get; init; }
    public string? Search { get; init; }
}
