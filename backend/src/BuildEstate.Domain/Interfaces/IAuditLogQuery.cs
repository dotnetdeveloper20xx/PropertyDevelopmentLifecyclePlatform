namespace BuildEstate.Domain.Interfaces;

/// <summary>
/// Interface for querying audit log entries.
/// AuditLog is not a BaseEntity (it's append-only), so it doesn't use IRepository.
/// </summary>
public interface IAuditLogQuery
{
    IQueryable<AuditLogEntry> Query();
}

/// <summary>
/// Read-only projection of audit log entries (no write operations exposed).
/// Defined at domain level to keep Application layer independent of Infrastructure.
/// </summary>
public class AuditLogEntry
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? AffectedColumns { get; set; }
    public DateTime Timestamp { get; set; }
    public string? IpAddress { get; set; }
    public string? CorrelationId { get; set; }
}
