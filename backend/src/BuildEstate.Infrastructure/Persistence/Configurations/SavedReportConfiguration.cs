using BuildEstate.Domain.Entities.Reports;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class SavedReportConfiguration : IEntityTypeConfiguration<SavedReport>
{
    public void Configure(EntityTypeBuilder<SavedReport> builder)
    {
        builder.ToTable("SavedReports");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title).IsRequired().HasMaxLength(300);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.ReportType).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Parameters).HasMaxLength(4000);
        builder.Property(x => x.GeneratedBy).HasMaxLength(200);
        builder.HasIndex(x => x.ReportType);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
