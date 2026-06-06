using BuildEstate.Domain.Entities.LandAcquisition;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder.ToTable("Offers");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Amount).HasPrecision(18, 2);
        builder.Property(x => x.Currency).HasMaxLength(10).HasDefaultValue("GBP");
        builder.Property(x => x.CounterOfferAmount).HasPrecision(18, 2);

        // Indexes for query performance
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => new { x.OpportunityId, x.Status });

        // Relationships
        builder.HasOne(x => x.Opportunity)
            .WithMany(o => o.Offers)
            .HasForeignKey(x => x.OpportunityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
