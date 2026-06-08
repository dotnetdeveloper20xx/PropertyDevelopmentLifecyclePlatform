using BuildEstate.Domain.Entities.Feasibility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BuildEstate.Infrastructure.Persistence.Configurations;

public class FeasibilityAssessmentConfiguration : IEntityTypeConfiguration<FeasibilityAssessment>
{
    public void Configure(EntityTypeBuilder<FeasibilityAssessment> builder)
    {
        builder.ToTable("FeasibilityAssessments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.EstimatedLandCost).HasPrecision(18, 2);
        builder.Property(x => x.EstimatedBuildCost).HasPrecision(18, 2);
        builder.Property(x => x.ProfessionalFees).HasPrecision(18, 2);
        builder.Property(x => x.FinanceCosts).HasPrecision(18, 2);
        builder.Property(x => x.GrossDevelopmentValue).HasPrecision(18, 2);
        builder.Property(x => x.ExpectedSalesRevenue).HasPrecision(18, 2);
        builder.Property(x => x.EstimatedProfit).HasPrecision(18, 2);
        builder.Property(x => x.ROI).HasPrecision(8, 4);
        builder.Property(x => x.Scenario).HasMaxLength(200);
        builder.Property(x => x.ApprovalNotes).HasMaxLength(4000);
        builder.Property(x => x.Notes).HasMaxLength(4000);
        builder.HasIndex(x => x.OpportunityId);
        builder.HasIndex(x => x.Status);
        builder.HasOne(x => x.Opportunity).WithMany().HasForeignKey(x => x.OpportunityId).OnDelete(DeleteBehavior.Restrict);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}
