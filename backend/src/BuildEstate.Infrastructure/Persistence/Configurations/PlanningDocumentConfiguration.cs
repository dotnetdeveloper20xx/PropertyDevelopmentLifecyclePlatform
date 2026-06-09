using BuildEstate.Domain.Entities.Planning;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PlanningDocumentConfiguration : IEntityTypeConfiguration<PlanningDocument>
{
    public void Configure(EntityTypeBuilder<PlanningDocument> builder)
    {
        builder.ToTable("PlanningDocuments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName).IsRequired().HasMaxLength(500);
        builder.Property(x => x.DocumentType).IsRequired().HasMaxLength(100);
        builder.Property(x => x.FilePath).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.Description).HasMaxLength(1000);

        // Indexes
        builder.HasIndex(x => x.PlanningApplicationId);
        builder.HasIndex(x => x.DocumentType);

        // Relationships
        builder.HasOne(x => x.PlanningApplication)
            .WithMany(p => p.Documents)
            .HasForeignKey(x => x.PlanningApplicationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
