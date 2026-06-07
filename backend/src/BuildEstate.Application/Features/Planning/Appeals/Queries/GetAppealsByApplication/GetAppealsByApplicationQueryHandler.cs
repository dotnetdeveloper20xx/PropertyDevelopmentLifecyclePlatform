using BuildEstate.Application.Features.Planning.Appeals.DTOs;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Planning.Appeals.Queries.GetAppealsByApplication;

/// <summary>
/// Handles retrieval of all appeals for a planning application.
/// </summary>
public class GetAppealsByApplicationQueryHandler
    : IRequestHandler<GetAppealsByApplicationQuery, List<PlanningAppealDto>>
{
    private readonly IRepository<PlanningAppeal> _repository;

    public GetAppealsByApplicationQueryHandler(IRepository<PlanningAppeal> repository)
    {
        _repository = repository;
    }

    public async Task<List<PlanningAppealDto>> Handle(
        GetAppealsByApplicationQuery request,
        CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.PlanningApplicationId == request.PlanningApplicationId)
            .OrderByDescending(x => x.AppealDate)
            .Select(x => new PlanningAppealDto
            {
                Id = x.Id,
                PlanningApplicationId = x.PlanningApplicationId,
                AppealReference = x.AppealReference,
                Status = x.Status,
                AppealDate = x.AppealDate,
                HearingDate = x.HearingDate,
                DecisionDate = x.DecisionDate,
                Inspector = x.Inspector,
                Grounds = x.Grounds,
                Decision = x.Decision,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
