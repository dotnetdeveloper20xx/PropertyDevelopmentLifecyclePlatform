using BuildEstate.Domain.Entities.LandAcquisition;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class DueDiligenceConfiguration : IEntityTypeConfiguration<DueDiligence>
{
    public void Configure(EntityTypeBuilder<DueDiligence> builder)
    {
        builder.ToTable("DueDiligences");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AssignedTo).HasMaxLength(200);
        builder.Property(x => x.RiskLevel).HasMaxLength(50);

        builder.HasOne(x => x.Opportunity)
            .WithMany(o => o.DueDiligences)
            .HasForeignKey(x => x.OpportunityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
