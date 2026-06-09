using BuildEstate.Domain.Entities.Planning;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PlanningAppealConfiguration : IEntityTypeConfiguration<PlanningAppeal>
{
    public void Configure(EntityTypeBuilder<PlanningAppeal> builder)
    {
        builder.ToTable("PlanningAppeals");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AppealReference).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Inspector).HasMaxLength(200);
        builder.Property(x => x.Grounds).HasMaxLength(4000);
        builder.Property(x => x.Decision).HasMaxLength(2000);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes
        builder.HasIndex(x => x.PlanningApplicationId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.AppealReference).IsUnique();

        // Relationships
        builder.HasOne(x => x.PlanningApplication)
            .WithMany(p => p.Appeals)
            .HasForeignKey(x => x.PlanningApplicationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
