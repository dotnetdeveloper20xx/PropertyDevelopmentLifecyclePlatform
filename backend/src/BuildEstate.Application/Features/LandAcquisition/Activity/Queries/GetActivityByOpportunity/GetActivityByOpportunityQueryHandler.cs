using BuildEstate.Application.Features.LandAcquisition.Activity.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.LandAcquisition.Activity.Queries.GetActivityByOpportunity;

/// <summary>
/// Retrieves audit log entries for an opportunity and all related sub-entities.
/// </summary>
public class GetActivityByOpportunityQueryHandler
    : IRequestHandler<GetActivityByOpportunityQuery, List<ActivityItemDto>>
{
    private readonly IAuditLogQuery _auditLogQuery;
    private readonly IRepository<DueDiligence> _ddRepository;
    private readonly IRepository<Offer> _offerRepository;
    private readonly IRepository<Document> _documentRepository;

    public GetActivityByOpportunityQueryHandler(
        IAuditLogQuery auditLogQuery,
        IRepository<DueDiligence> ddRepository,
        IRepository<Offer> offerRepository,
        IRepository<Document> documentRepository)
    {
        _auditLogQuery = auditLogQuery;
        _ddRepository = ddRepository;
        _offerRepository = offerRepository;
        _documentRepository = documentRepository;
    }

    public async Task<List<ActivityItemDto>> Handle(
        GetActivityByOpportunityQuery request,
        CancellationToken cancellationToken)
    {
        var opportunityIdStr = request.OpportunityId.ToString();

        // Collect all related entity IDs
        var relatedEntityIds = new List<string> { opportunityIdStr };

        var ddIds = await _ddRepository.Query()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .Select(x => x.Id.ToString())
            .ToListAsync(cancellationToken);

        var offerIds = await _offerRepository.Query()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .Select(x => x.Id.ToString())
            .ToListAsync(cancellationToken);

        var docIds = await _documentRepository.Query()
            .Where(x => x.OpportunityId == request.OpportunityId)
            .Select(x => x.Id.ToString())
            .ToListAsync(cancellationToken);

        relatedEntityIds.AddRange(ddIds);
        relatedEntityIds.AddRange(offerIds);
        relatedEntityIds.AddRange(docIds);

        return await _auditLogQuery.Query()
            .Where(a => relatedEntityIds.Contains(a.EntityId))
            .OrderByDescending(a => a.Timestamp)
            .Take(50)
            .Select(a => new ActivityItemDto
            {
                Id = a.Id,
                Action = a.Action,
                EntityName = a.EntityName,
                EntityId = a.EntityId,
                UserName = a.UserName,
                Timestamp = a.Timestamp,
                AffectedColumns = a.AffectedColumns,
                OldValues = a.OldValues,
                NewValues = a.NewValues
            })
            .ToListAsync(cancellationToken);
    }
}
