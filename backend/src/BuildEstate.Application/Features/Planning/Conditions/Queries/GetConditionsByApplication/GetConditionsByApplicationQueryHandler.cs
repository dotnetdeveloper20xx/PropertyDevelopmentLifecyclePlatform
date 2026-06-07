using BuildEstate.Application.Features.Planning.Conditions.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Planning.Conditions.Queries.GetConditionsByApplication;

/// <summary>
/// Handles retrieval of all conditions for a planning application.
/// </summary>
public class GetConditionsByApplicationQueryHandler
    : IRequestHandler<GetConditionsByApplicationQuery, List<PlanningConditionDto>>
{
    private readonly IRepository<PlanningCondition> _repository;

    public GetConditionsByApplicationQueryHandler(IRepository<PlanningCondition> repository)
    {
        _repository = repository;
    }

    public async Task<List<PlanningConditionDto>> Handle(
        GetConditionsByApplicationQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.PlanningApplicationId == request.PlanningApplicationId)
            .OrderBy(x => x.ConditionNumber)
            .Select(x => new PlanningConditionDto
            {
                Id = x.Id,
                PlanningApplicationId = x.PlanningApplicationId,
                ConditionNumber = x.ConditionNumber,
                Title = x.Title,
                Description = x.Description,
                Status = x.Status,
                DueDate = x.DueDate,
                DischargeDate = x.DischargeDate,
                DischargeReference = x.DischargeReference,
                AssignedTo = x.AssignedTo,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
