using BuildEstate.Domain.Entities.Units;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PropertyUnitConfiguration : IEntityTypeConfiguration<PropertyUnit>
{
    public void Configure(EntityTypeBuilder<PropertyUnit> builder)
    {
        builder.ToTable("PropertyUnits");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.UnitReference).IsRequired().HasMaxLength(100);
        builder.Property(x => x.UnitType).HasMaxLength(100);
        builder.Property(x => x.FloorArea).HasPrecision(10, 2);
        builder.Property(x => x.Price).HasPrecision(18, 2);
        builder.Property(x => x.Floor).HasMaxLength(50);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.ProjectId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.UnitReference);
        builder.HasOne(x => x.Project).WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Restrict);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
