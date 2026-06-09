using BuildEstate.Domain.Entities.Construction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class InspectionConfiguration : IEntityTypeConfiguration<Inspection>
{
    public void Configure(EntityTypeBuilder<Inspection> builder)
    {
        builder.ToTable("Inspections");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Inspector).HasMaxLength(200);
        builder.Property(x => x.Findings).HasMaxLength(4000);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.ConstructionStageId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.ScheduledDate);
        builder.HasOne(x => x.ConstructionStage).WithMany(s => s.Inspections).HasForeignKey(x => x.ConstructionStageId).OnDelete(DeleteBehavior.Restrict);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
