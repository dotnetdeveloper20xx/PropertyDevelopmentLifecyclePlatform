using BuildEstate.Domain.Entities.Rentals;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class TenancyConfiguration : IEntityTypeConfiguration<Tenancy>
{
    public void Configure(EntityTypeBuilder<Tenancy> builder)
    {
        builder.ToTable("Tenancies");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.TenantName).IsRequired().HasMaxLength(300);
        builder.Property(x => x.TenantEmail).HasMaxLength(200);
        builder.Property(x => x.TenantPhone).HasMaxLength(50);
        builder.Property(x => x.MonthlyRent).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.PropertyUnitId);
        builder.HasIndex(x => x.Status);
        builder.HasOne(x => x.PropertyUnit).WithMany().HasForeignKey(x => x.PropertyUnitId).OnDelete(DeleteBehavior.Cascade);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
