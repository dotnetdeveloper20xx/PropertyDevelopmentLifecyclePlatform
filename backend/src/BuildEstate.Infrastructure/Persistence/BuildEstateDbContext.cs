using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Identity;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Main application DbContext with Identity support.
/// </summary>
public class BuildEstateDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    public BuildEstateDbContext(DbContextOptions<BuildEstateDbContext> options)
        : base(options)
    {
    }

    // Identity
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // Land Acquisition
    public DbSet<LandOpportunity> LandOpportunities => Set<LandOpportunity>();
    public DbSet<LandOwner> LandOwners => Set<LandOwner>();
    public DbSet<DueDiligence> DueDiligences => Set<DueDiligence>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<LandAcquisitionRecord> LandAcquisitions => Set<LandAcquisitionRecord>();

    // Audit
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(BuildEstateDbContext).Assembly);

        // Apply RowVersion concurrency token to ALL entities inheriting BaseEntity
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                builder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.RowVersion))
                    .IsRowVersion();
            }
        }
    }
}
