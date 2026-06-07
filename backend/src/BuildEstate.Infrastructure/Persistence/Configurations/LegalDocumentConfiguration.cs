using BuildEstate.Domain.Entities.Legal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class LegalDocumentConfiguration : IEntityTypeConfiguration<LegalDocument>
{
    public void Configure(EntityTypeBuilder<LegalDocument> builder)
    {
        builder.ToTable("LegalDocuments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.DocumentTitle).IsRequired().HasMaxLength(500);
        builder.Property(x => x.FilePath).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.FileName).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ReviewedBy).HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes
        builder.HasIndex(x => x.ContractId);
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.DocumentType);
        builder.HasIndex(x => x.Status);

        // Relationships
        builder.HasOne(x => x.Contract)
            .WithMany(c => c.Documents)
            .HasForeignKey(x => x.ContractId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
