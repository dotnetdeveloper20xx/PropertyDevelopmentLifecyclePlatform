namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Immutable audit log entry for tracking all data changes.
/// This entity is append-only — no updates or deletes are permitted.
/// Supports compliance reporting, investigation, and regulatory audits.
/// </summary>
public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Create, Update, Delete
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? AffectedColumns { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? IpAddress { get; set; }
    public string? CorrelationId { get; set; }
    public string? UserAgent { get; set; }
}
