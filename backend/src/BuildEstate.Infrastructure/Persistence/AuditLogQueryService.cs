using BuildEstate.Domain.Interfaces;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Implementation of IAuditLogQuery using BuildEstateDbContext.
/// Maps from Infrastructure AuditLog entity to Domain AuditLogEntry.
/// </summary>
public class AuditLogQueryService : IAuditLogQuery
{
    private readonly BuildEstateDbContext _context;

    public AuditLogQueryService(BuildEstateDbContext context)
    {
        _context = context;
    }

    public IQueryable<AuditLogEntry> Query()
    {
        return _context.AuditLogs.Select(a => new AuditLogEntry
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = a.UserName,
            Action = a.Action,
            EntityName = a.EntityName,
            EntityId = a.EntityId,
            OldValues = a.OldValues,
            NewValues = a.NewValues,
            AffectedColumns = a.AffectedColumns,
            Timestamp = a.Timestamp,
            IpAddress = a.IpAddress,
            CorrelationId = a.CorrelationId
        });
    }
}
