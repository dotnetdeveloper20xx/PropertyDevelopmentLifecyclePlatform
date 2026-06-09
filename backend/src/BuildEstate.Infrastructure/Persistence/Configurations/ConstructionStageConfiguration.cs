using BuildEstate.Domain.Entities.Construction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class ConstructionStageConfiguration : IEntityTypeConfiguration<ConstructionStage>
{
    public void Configure(EntityTypeBuilder<ConstructionStage> builder)
    {
        builder.ToTable("ConstructionStages");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(300);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.ProgressPercent).HasPrecision(5, 2);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.ProjectId);
        builder.HasIndex(x => x.Status);
        builder.HasOne(x => x.Project).WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Restrict);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
