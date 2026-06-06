using BuildEstate.Domain.Entities.LandAcquisition;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class LandOwnerConfiguration : IEntityTypeConfiguration<LandOwner>
{
    public void Configure(EntityTypeBuilder<LandOwner> builder)
    {
        builder.ToTable("LandOwners");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.ContactEmail).HasMaxLength(200);
        builder.Property(x => x.ContactPhone).HasMaxLength(50);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.CompanyName).HasMaxLength(200);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
