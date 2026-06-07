using BuildEstate.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class SalesLeadConfiguration : IEntityTypeConfiguration<SalesLead>
{
    public void Configure(EntityTypeBuilder<SalesLead> builder)
    {
        builder.ToTable("SalesLeads");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(300);
        builder.Property(x => x.Email).HasMaxLength(200);
        builder.Property(x => x.Phone).HasMaxLength(50);
        builder.Property(x => x.Source).HasMaxLength(200);
        builder.Property(x => x.InterestDetails).HasMaxLength(2000);
        builder.Property(x => x.Budget).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.ProjectId);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
