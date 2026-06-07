namespace BuildEstate.Domain.Common;

/// <summary>
/// Base entity with audit fields. All domain entities inherit from this.
/// Implements IAuditableEntity to support automatic audit tracking via EF Core interceptor.
/// 
/// IMPORTANT: Do not set CreatedAt/CreatedBy manually in handlers.
/// The AuditableDbContextInterceptor is the sole owner of audit timestamp/user assignment.
/// </summary>
public abstract class BaseEntity : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }

    /// <summary>
    /// Concurrency token for optimistic locking. EF Core checks this on every UPDATE.
    /// If another user modified the row since we read it, a DbUpdateConcurrencyException is thrown.
    /// </summary>
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
