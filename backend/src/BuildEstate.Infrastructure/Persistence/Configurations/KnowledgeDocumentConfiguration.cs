using BuildEstate.Domain.Entities.Documents;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class KnowledgeDocumentConfiguration : IEntityTypeConfiguration<KnowledgeDocument>
{
    public void Configure(EntityTypeBuilder<KnowledgeDocument> builder)
    {
        builder.ToTable("KnowledgeDocuments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.FileName).IsRequired().HasMaxLength(500);
        builder.Property(x => x.FilePath).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.Tags).HasMaxLength(1000);
        builder.Property(x => x.UploadedBy).HasMaxLength(200);
        builder.HasIndex(x => x.ProjectId);
        builder.HasIndex(x => x.Category);
        builder.HasIndex(x => x.Title);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
