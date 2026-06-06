using System.Text.Json;
using BuildEstate.Application.Interfaces;
using BuildEstate.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// EF Core SaveChanges interceptor that:
/// 1. Automatically sets CreatedBy/UpdatedBy/DeletedBy audit fields
/// 2. Writes immutable AuditLog entries for every Create, Update, Delete operation
/// 
/// This ensures complete audit trail compliance without requiring
/// individual handlers to manage audit concerns.
/// </summary>
public class AuditableDbContextInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserService _currentUserService;

    public AuditableDbContextInterceptor(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is null)
            return await base.SavingChangesAsync(eventData, result, cancellationToken);

        var context = eventData.Context;
        var userId = _currentUserService.UserId ?? "system";
        var userName = _currentUserService.UserName ?? "system";
        var now = DateTime.UtcNow;

        var auditEntries = new List<AuditLog>();

        foreach (var entry in context.ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = now;
                    entry.Entity.CreatedBy = userId;
                    auditEntries.Add(CreateAuditEntry(entry, "Create", userId, userName));
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdatedAt = now;
                    entry.Entity.UpdatedBy = userId;

                    // Handle soft delete tracking
                    if (entry.Entity.IsDeleted && entry.Property(nameof(BaseEntity.IsDeleted)).IsModified)
                    {
                        entry.Entity.DeletedAt = now;
                        entry.Entity.DeletedBy = userId;
                        auditEntries.Add(CreateAuditEntry(entry, "Delete", userId, userName));
                    }
                    else
                    {
                        auditEntries.Add(CreateAuditEntry(entry, "Update", userId, userName));
                    }
                    break;

                case EntityState.Deleted:
                    // Convert hard deletes to soft deletes
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = now;
                    entry.Entity.DeletedBy = userId;
                    auditEntries.Add(CreateAuditEntry(entry, "Delete", userId, userName));
                    break;
            }
        }

        if (auditEntries.Count > 0)
        {
            context.Set<AuditLog>().AddRange(auditEntries);
        }

        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private AuditLog CreateAuditEntry(EntityEntry<BaseEntity> entry, string action, string userId, string userName)
    {
        var auditLog = new AuditLog
        {
            UserId = userId,
            UserName = userName,
            Action = action,
            EntityName = entry.Entity.GetType().Name,
            EntityId = entry.Entity.Id.ToString(),
            Timestamp = DateTime.UtcNow,
            IpAddress = _currentUserService.IpAddress,
            CorrelationId = _currentUserService.CorrelationId
        };

        var oldValues = new Dictionary<string, object?>();
        var newValues = new Dictionary<string, object?>();
        var affectedColumns = new List<string>();

        foreach (var property in entry.Properties)
        {
            var propertyName = property.Metadata.Name;

            switch (entry.State)
            {
                case EntityState.Added:
                    newValues[propertyName] = property.CurrentValue;
                    break;

                case EntityState.Modified:
                    if (property.IsModified)
                    {
                        oldValues[propertyName] = property.OriginalValue;
                        newValues[propertyName] = property.CurrentValue;
                        affectedColumns.Add(propertyName);
                    }
                    break;
            }
        }

        if (oldValues.Count > 0)
            auditLog.OldValues = JsonSerializer.Serialize(oldValues);

        if (newValues.Count > 0)
            auditLog.NewValues = JsonSerializer.Serialize(newValues);

        if (affectedColumns.Count > 0)
            auditLog.AffectedColumns = string.Join(",", affectedColumns);

        return auditLog;
    }
}
