using BuildEstate.Domain.Entities.Projects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(300);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.ProjectReference).IsRequired().HasMaxLength(100);
        builder.Property(x => x.ProjectManager).HasMaxLength(200);
        builder.Property(x => x.SiteAddress).HasMaxLength(500);
        builder.Property(x => x.Budget).HasPrecision(18, 2);
        builder.Property(x => x.ActualCost).HasPrecision(18, 2);
        builder.Property(x => x.ProgressPercent).HasPrecision(5, 2);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => new { x.Status, x.CreatedAt });
        builder.HasIndex(x => x.ProjectReference).IsUnique();

        builder.HasOne(x => x.Opportunity)
            .WithMany()
            .HasForeignKey(x => x.OpportunityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
