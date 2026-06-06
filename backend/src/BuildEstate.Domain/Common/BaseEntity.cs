namespace BuildEstate.Domain.Common;

/// <summary>
/// Base entity with audit fields. All domain entities inherit from this.
/// Implements IAuditableEntity to support automatic audit tracking via EF Core interceptor.
/// </summary>
public abstract class BaseEntity : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}
