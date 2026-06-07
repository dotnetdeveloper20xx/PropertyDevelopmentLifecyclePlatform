using BuildEstate.Domain.Entities.Planning;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PlanningApplicationConfiguration : IEntityTypeConfiguration<PlanningApplication>
{
    public void Configure(EntityTypeBuilder<PlanningApplication> builder)
    {
        builder.ToTable("PlanningApplications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ApplicationReference).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Description).IsRequired().HasMaxLength(2000);
        builder.Property(x => x.LocalAuthority).IsRequired().HasMaxLength(200);
        builder.Property(x => x.ApplicationType).IsRequired().HasMaxLength(100);
        builder.Property(x => x.DecisionNotice).HasMaxLength(2000);
        builder.Property(x => x.PlanningOfficer).HasMaxLength(200);
        builder.Property(x => x.CaseOfficerEmail).HasMaxLength(200);
        builder.Property(x => x.Ward).HasMaxLength(200);
        builder.Property(x => x.SiteAddress).HasMaxLength(500);
        builder.Property(x => x.ApplicationFee).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes for query performance
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => new { x.Status, x.CreatedAt });
        builder.HasIndex(x => x.ApplicationReference).IsUnique();
        builder.HasIndex(x => x.LocalAuthority);

        // Relationships
        builder.HasOne(x => x.Opportunity)
            .WithMany()
            .HasForeignKey(x => x.OpportunityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
