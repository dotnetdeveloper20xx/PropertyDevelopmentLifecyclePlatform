using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Infrastructure.Identity;
using BuildEstate.Infrastructure.Persistence.Configurations;
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
    }
}
