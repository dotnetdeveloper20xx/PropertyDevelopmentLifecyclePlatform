using BuildEstate.Domain.Entities.Portfolio;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
{
    public void Configure(EntityTypeBuilder<Portfolio> builder)
    {
        builder.ToTable("Portfolios");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(300);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.Region).HasMaxLength(200);
        builder.Property(x => x.TargetInvestment).HasPrecision(18, 2);
        builder.Property(x => x.TargetProfit).HasPrecision(18, 2);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Region);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
