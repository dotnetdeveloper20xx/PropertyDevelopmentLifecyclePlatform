using BuildEstate.Domain.Entities.Contractors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class ContractorConfiguration : IEntityTypeConfiguration<Contractor>
{
    public void Configure(EntityTypeBuilder<Contractor> builder)
    {
        builder.ToTable("Contractors");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CompanyName).IsRequired().HasMaxLength(300);
        builder.Property(x => x.ContactName).HasMaxLength(200);
        builder.Property(x => x.Email).HasMaxLength(200);
        builder.Property(x => x.Phone).HasMaxLength(50);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.Trade).HasMaxLength(200);
        builder.Property(x => x.Rating).HasPrecision(3, 1);
        builder.Property(x => x.InsuranceDetails).HasMaxLength(1000);
        builder.Property(x => x.Certifications).HasMaxLength(2000);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Type);
        builder.HasIndex(x => x.CompanyName);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
