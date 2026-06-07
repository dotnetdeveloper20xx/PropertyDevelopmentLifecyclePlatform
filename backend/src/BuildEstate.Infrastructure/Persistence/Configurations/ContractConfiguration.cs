using BuildEstate.Domain.Entities.Legal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class ContractConfiguration : IEntityTypeConfiguration<Contract>
{
    public void Configure(EntityTypeBuilder<Contract> builder)
    {
        builder.ToTable("Contracts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ContractReference).IsRequired().HasMaxLength(100);
        builder.Property(x => x.CounterpartyName).IsRequired().HasMaxLength(300);
        builder.Property(x => x.CounterpartyContact).HasMaxLength(300);
        builder.Property(x => x.ContractValue).HasPrecision(18, 2);
        builder.Property(x => x.Currency).HasMaxLength(10);
        builder.Property(x => x.Solicitor).HasMaxLength(200);
        builder.Property(x => x.SolicitorFirm).HasMaxLength(300);
        builder.Property(x => x.SolicitorEmail).HasMaxLength(200);
        builder.Property(x => x.KeyTerms).HasMaxLength(4000);
        builder.Property(x => x.Notes).HasMaxLength(4000);

        // Indexes
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.ContractType);
        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => new { x.Status, x.CreatedAt });
        builder.HasIndex(x => x.ContractReference).IsUnique();

        // Relationships
        builder.HasOne(x => x.Opportunity)
            .WithMany()
            .HasForeignKey(x => x.OpportunityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
