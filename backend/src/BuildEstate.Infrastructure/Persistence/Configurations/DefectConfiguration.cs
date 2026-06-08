using BuildEstate.Domain.Entities.Defects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class DefectConfiguration : IEntityTypeConfiguration<Defect>
{
    public void Configure(EntityTypeBuilder<Defect> builder)
    {
        builder.ToTable("Defects");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.Location).HasMaxLength(300);
        builder.Property(x => x.ReportedBy).HasMaxLength(200);
        builder.Property(x => x.AssignedTo).HasMaxLength(200);
        builder.Property(x => x.Resolution).HasMaxLength(2000);
        builder.Property(x => x.WarrantyReference).HasMaxLength(100);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.PropertyUnitId);
        builder.HasIndex(x => x.ProjectId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Priority);
        builder.HasOne(x => x.PropertyUnit).WithMany().HasForeignKey(x => x.PropertyUnitId).OnDelete(DeleteBehavior.SetNull);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
