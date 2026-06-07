using BuildEstate.Domain.Entities.Construction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class SnagConfiguration : IEntityTypeConfiguration<Snag>
{
    public void Configure(EntityTypeBuilder<Snag> builder)
    {
        builder.ToTable("Snags");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.Location).HasMaxLength(300);
        builder.Property(x => x.AssignedTo).HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.ConstructionStageId);
        builder.HasIndex(x => x.InspectionId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Priority);
        builder.HasOne(x => x.ConstructionStage).WithMany(s => s.Snags).HasForeignKey(x => x.ConstructionStageId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Inspection).WithMany().HasForeignKey(x => x.InspectionId).OnDelete(DeleteBehavior.SetNull);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
