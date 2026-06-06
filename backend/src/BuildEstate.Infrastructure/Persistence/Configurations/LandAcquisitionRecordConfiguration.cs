using BuildEstate.Domain.Entities.LandAcquisition;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class LandAcquisitionRecordConfiguration : IEntityTypeConfiguration<LandAcquisitionRecord>
{
    public void Configure(EntityTypeBuilder<LandAcquisitionRecord> builder)
    {
        builder.ToTable("LandAcquisitions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.PurchasePrice).HasPrecision(18, 2);
        builder.Property(x => x.Currency).HasMaxLength(10).HasDefaultValue("GBP");
        builder.Property(x => x.RegistryReference).HasMaxLength(200);
        builder.Property(x => x.SolicitorName).HasMaxLength(200);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
