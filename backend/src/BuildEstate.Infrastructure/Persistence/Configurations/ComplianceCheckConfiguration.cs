using BuildEstate.Domain.Entities.Legal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class ComplianceCheckConfiguration : IEntityTypeConfiguration<ComplianceCheck>
{
    public void Configure(EntityTypeBuilder<ComplianceCheck> builder)
    {
        builder.ToTable("ComplianceChecks");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AssignedTo).HasMaxLength(200);
        builder.Property(x => x.Outcome).HasMaxLength(2000);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.CheckType);
        builder.HasIndex(x => new { x.OpportunityId, x.CheckType });

        // Relationships
        builder.HasOne(x => x.Opportunity)
            .WithMany()
            .HasForeignKey(x => x.OpportunityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
