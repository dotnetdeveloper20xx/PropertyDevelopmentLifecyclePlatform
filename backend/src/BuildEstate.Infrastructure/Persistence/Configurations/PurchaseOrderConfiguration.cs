using BuildEstate.Domain.Entities.Procurement;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.ToTable("PurchaseOrders");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.OrderReference).IsRequired().HasMaxLength(100);
        builder.Property(x => x.SupplierName).IsRequired().HasMaxLength(300);
        builder.Property(x => x.SupplierContact).HasMaxLength(300);
        builder.Property(x => x.Description).HasMaxLength(2000);
        builder.Property(x => x.TotalValue).HasPrecision(18, 2);
        builder.Property(x => x.Currency).HasMaxLength(10);
        builder.Property(x => x.ApprovedBy).HasMaxLength(200);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.ProjectId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.OrderReference).IsUnique();
        builder.HasIndex(x => x.OrderDate);
        builder.HasOne(x => x.Project).WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Restrict);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
