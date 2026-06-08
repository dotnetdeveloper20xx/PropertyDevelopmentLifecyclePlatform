using BuildEstate.Domain.Entities.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class DesignPackageConfiguration : IEntityTypeConfiguration<DesignPackage>
{
    public void Configure(EntityTypeBuilder<DesignPackage> builder)
    {
        builder.ToTable("DesignPackages");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.Discipline).HasMaxLength(200);
        builder.Property(x => x.Consultant).HasMaxLength(300);
        builder.Property(x => x.ConsultantEmail).HasMaxLength(200);
        builder.Property(x => x.ApprovedBy).HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.ProjectId);
        builder.HasIndex(x => x.Status);
        builder.HasOne(x => x.Project).WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
