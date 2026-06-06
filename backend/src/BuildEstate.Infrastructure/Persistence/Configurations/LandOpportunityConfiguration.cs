using BuildEstate.Domain.Entities.LandAcquisition;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class LandOpportunityConfiguration : IEntityTypeConfiguration<LandOpportunity>
{
    public void Configure(EntityTypeBuilder<LandOpportunity> builder)
    {
        builder.ToTable("LandOpportunities");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Location).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.PostCode).HasMaxLength(20);
        builder.Property(x => x.LandSize).HasPrecision(18, 4);
        builder.Property(x => x.LandSizeUnit).HasMaxLength(50);
        builder.Property(x => x.AskingPrice).HasPrecision(18, 2);
        builder.Property(x => x.EstimatedValue).HasPrecision(18, 2);
        builder.Property(x => x.EstimatedDevelopmentCost).HasPrecision(18, 2);
        builder.Property(x => x.EstimatedProfit).HasPrecision(18, 2);
        builder.Property(x => x.ROI).HasPrecision(8, 4);
        builder.Property(x => x.Source).HasMaxLength(200);
        builder.Property(x => x.AgentName).HasMaxLength(200);

        // Indexes for query performance
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => new { x.Status, x.CreatedAt });
        builder.HasIndex(x => x.LandOwnerId);
        builder.HasIndex(x => new { x.Name, x.Location });

        // Relationships
        builder.HasOne(x => x.LandOwner)
            .WithMany(o => o.Opportunities)
            .HasForeignKey(x => x.LandOwnerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Acquisition)
            .WithOne(a => a.Opportunity)
            .HasForeignKey<LandAcquisitionRecord>(a => a.OpportunityId);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
