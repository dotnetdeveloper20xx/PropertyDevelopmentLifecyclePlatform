using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Entities.Contractors;
using BuildEstate.Domain.Entities.Defects;
using BuildEstate.Domain.Entities.Design;
using BuildEstate.Domain.Entities.Documents;
using BuildEstate.Domain.Entities.Feasibility;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.Identity;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Entities.Portfolio;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Entities.Rentals;
using BuildEstate.Domain.Entities.Reports;
using BuildEstate.Domain.Entities.Sales;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Main application DbContext with Identity support.
/// </summary>
public class BuildEstateDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    public BuildEstateDbContext(DbContextOptions<BuildEstateDbContext> options)
        : base(options)
    {
    }

    // Identity
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    // Land Acquisition
    public DbSet<LandOpportunity> LandOpportunities => Set<LandOpportunity>();
    public DbSet<LandOwner> LandOwners => Set<LandOwner>();
    public DbSet<DueDiligence> DueDiligences => Set<DueDiligence>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<LandAcquisitionRecord> LandAcquisitions => Set<LandAcquisitionRecord>();

    // Planning & Approvals
    public DbSet<PlanningApplication> PlanningApplications => Set<PlanningApplication>();
    public DbSet<PlanningCondition> PlanningConditions => Set<PlanningCondition>();
    public DbSet<PlanningAppeal> PlanningAppeals => Set<PlanningAppeal>();
    public DbSet<PlanningDocument> PlanningDocuments => Set<PlanningDocument>();

    // Legal & Compliance
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<LegalDocument> LegalDocuments => Set<LegalDocument>();
    public DbSet<ComplianceCheck> ComplianceChecks => Set<ComplianceCheck>();
    public DbSet<LegalTask> LegalTasks => Set<LegalTask>();

    // Project Management
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Milestone> Milestones => Set<Milestone>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<ProjectRisk> ProjectRisks => Set<ProjectRisk>();

    // Construction Management
    public DbSet<ConstructionStage> ConstructionStages => Set<ConstructionStage>();
    public DbSet<Inspection> Inspections => Set<Inspection>();
    public DbSet<Snag> Snags => Set<Snag>();

    // Procurement & Materials
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<Delivery> Deliveries => Set<Delivery>();

    // Contractors & Suppliers
    public DbSet<Contractor> Contractors => Set<Contractor>();

    // Finance & Budget
    public DbSet<BudgetLine> BudgetLines => Set<BudgetLine>();
    public DbSet<FinancialTransaction> FinancialTransactions => Set<FinancialTransaction>();
    public DbSet<Investor> Investors => Set<Investor>();

    // Property Units
    public DbSet<PropertyUnit> PropertyUnits => Set<PropertyUnit>();

    // Sales
    public DbSet<SalesLead> SalesLeads => Set<SalesLead>();

    // Rentals
    public DbSet<Tenancy> Tenancies => Set<Tenancy>();

    // Documents & Knowledge
    public DbSet<KnowledgeDocument> KnowledgeDocuments => Set<KnowledgeDocument>();

    // Reports
    public DbSet<SavedReport> SavedReports => Set<SavedReport>();

    // Portfolio Strategy
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();

    // Feasibility & Viability
    public DbSet<FeasibilityAssessment> FeasibilityAssessments => Set<FeasibilityAssessment>();

    // Design & Professional Services
    public DbSet<DesignPackage> DesignPackages => Set<DesignPackage>();

    // Defects & Warranty
    public DbSet<Defect> Defects => Set<Defect>();

    // Audit
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(BuildEstateDbContext).Assembly);

        // Fix Identity cascade delete to avoid SQL Server multiple cascade path error
        // AspNetUserRoles has FK to both Users AND Roles — can't have CASCADE on both
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<string>>()
            .HasOne<ApplicationUser>().WithMany().HasForeignKey(ur => ur.UserId).OnDelete(DeleteBehavior.NoAction);
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserRole<string>>()
            .HasOne<ApplicationRole>().WithMany().HasForeignKey(ur => ur.RoleId).OnDelete(DeleteBehavior.NoAction);

        // Apply RowVersion concurrency token to ALL entities inheriting BaseEntity
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                builder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.RowVersion))
                    .IsRowVersion();
            }
        }
    }
}
