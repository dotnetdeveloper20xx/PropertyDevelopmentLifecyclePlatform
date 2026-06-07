using BuildEstate.Domain.Entities.Planning;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PlanningConditionConfiguration : IEntityTypeConfiguration<PlanningCondition>
{
    public void Configure(EntityTypeBuilder<PlanningCondition> builder)
    {
        builder.ToTable("PlanningConditions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Description).IsRequired().HasMaxLength(2000);
        builder.Property(x => x.DischargeReference).HasMaxLength(100);
        builder.Property(x => x.AssignedTo).HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes
        builder.HasIndex(x => x.PlanningApplicationId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => new { x.PlanningApplicationId, x.ConditionNumber }).IsUnique();

        // Relationships
        builder.HasOne(x => x.PlanningApplication)
            .WithMany(p => p.Conditions)
            .HasForeignKey(x => x.PlanningApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
