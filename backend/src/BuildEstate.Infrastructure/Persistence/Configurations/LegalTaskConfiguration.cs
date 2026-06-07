using BuildEstate.Domain.Entities.Legal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class LegalTaskConfiguration : IEntityTypeConfiguration<LegalTask>
{
    public void Configure(EntityTypeBuilder<LegalTask> builder)
    {
        builder.ToTable("LegalTasks");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.AssignedTo).HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes
        builder.HasIndex(x => x.ContractId);
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Priority);
        builder.HasIndex(x => x.DueDate);
        builder.HasIndex(x => new { x.Status, x.DueDate });

        // Relationships
        builder.HasOne(x => x.Contract)
            .WithMany(c => c.Tasks)
            .HasForeignKey(x => x.ContractId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
