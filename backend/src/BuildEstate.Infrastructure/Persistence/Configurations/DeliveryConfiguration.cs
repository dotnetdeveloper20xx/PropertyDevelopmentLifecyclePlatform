using BuildEstate.Domain.Entities.Procurement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class DeliveryConfiguration : IEntityTypeConfiguration<Delivery>
{
    public void Configure(EntityTypeBuilder<Delivery> builder)
    {
        builder.ToTable("Deliveries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.DeliveryReference).HasMaxLength(100);
        builder.Property(x => x.ReceivedBy).HasMaxLength(200);
        builder.Property(x => x.Items).HasMaxLength(4000);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.PurchaseOrderId);
        builder.HasIndex(x => x.Status);
        builder.HasOne(x => x.PurchaseOrder).WithMany(po => po.Deliveries).HasForeignKey(x => x.PurchaseOrderId).OnDelete(DeleteBehavior.Restrict);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
