using BuildEstate.Domain.Entities.Construction;
using BuildEstate.Domain.Entities.Contractors;
using BuildEstate.Domain.Entities.Documents;
using BuildEstate.Domain.Entities.Finance;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Entities.Legal;
using BuildEstate.Domain.Entities.Planning;
using BuildEstate.Domain.Entities.Procurement;
using BuildEstate.Domain.Entities.Projects;
using BuildEstate.Domain.Entities.Rentals;
using BuildEstate.Domain.Entities.Reports;
using BuildEstate.Domain.Entities.Sales;
using BuildEstate.Domain.Entities.Units;
using BuildEstate.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Seeds comprehensive demo data across all modules for demonstration purposes.
/// Only runs if no projects exist (avoids re-seeding on restarts).
/// </summary>
public static class DemoDataSeeder
{
    public static async Task SeedDemoDataAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BuildEstateDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<BuildEstateDbContext>>();

        // Only seed if no projects exist (fresh database)
        if (await context.Projects.AnyAsync()) return;

        logger.LogInformation("Seeding demo data for all modules...");

        // ─── MODULE 1: LAND ACQUISITION ───
        var opp1 = new LandOpportunity
        {
            Name = "Riverside Apartments", Location = "Wandsworth, London", Address = "45 Riverside Road, SW18 4SJ",
            PostCode = "SW18 4SJ", LandSize = 2.45m, LandSizeUnit = "Acres", CurrentUse = "Brownfield",
            Status = OpportunityStatus.Acquired, Source = "Agent Referral", AgentName = "Knight Frank",
            AskingPrice = 4500000, EstimatedValue = 5200000, EstimatedDevelopmentCost = 38000000,
            EstimatedProfit = 19000000, ROI = 47.6m, PlanningPotential = "Residential - 100 units",
            CreatedBy = "system"
        };
        var opp2 = new LandOpportunity
        {
            Name = "Oakwood Gardens", Location = "Richmond, London", Address = "12 Oak Lane, TW9 2PQ",
            PostCode = "TW9 2PQ", LandSize = 1.8m, LandSizeUnit = "Acres", CurrentUse = "Vacant Land",
            Status = OpportunityStatus.DueDiligence, Source = "Online Listing", AgentName = "Savills",
            AskingPrice = 3200000, EstimatedValue = 3800000, PlanningPotential = "Mixed Use - 48 units",
            CreatedBy = "system"
        };
        var opp3 = new LandOpportunity
        {
            Name = "Harbour View", Location = "Canary Wharf, London", Address = "1 Dock Road, E14 9AB",
            PostCode = "E14 9AB", LandSize = 0.95m, LandSizeUnit = "Acres", CurrentUse = "Car Park",
            Status = OpportunityStatus.OfferMade, Source = "Direct Contact", AskingPrice = 8500000,
            EstimatedDevelopmentCost = 52000000, PlanningPotential = "Tower - 200 units", CreatedBy = "system"
        };
        var opp4 = new LandOpportunity
        {
            Name = "Meadow Fields", Location = "Guildford, Surrey", LandSize = 5.2m,
            Status = OpportunityStatus.Identified, Source = "Auction", AskingPrice = 2100000, CreatedBy = "system"
        };
        var opp5 = new LandOpportunity
        {
            Name = "Station Quarter", Location = "Woking, Surrey", LandSize = 3.1m,
            Status = OpportunityStatus.InitialReview, Source = "Agent Referral", AskingPrice = 6800000, CreatedBy = "system"
        };
        context.LandOpportunities.AddRange(opp1, opp2, opp3, opp4, opp5);

        // Due Diligence
        context.DueDiligences.AddRange(
            new DueDiligence { OpportunityId = opp1.Id, Type = DueDiligenceType.Legal, Status = DueDiligenceStatus.Completed, AssignedTo = "Sarah Johnson", CreatedBy = "system" },
            new DueDiligence { OpportunityId = opp1.Id, Type = DueDiligenceType.Environmental, Status = DueDiligenceStatus.Completed, RiskLevel = "Low", CreatedBy = "system" },
            new DueDiligence { OpportunityId = opp1.Id, Type = DueDiligenceType.Planning, Status = DueDiligenceStatus.Completed, CreatedBy = "system" },
            new DueDiligence { OpportunityId = opp2.Id, Type = DueDiligenceType.Legal, Status = DueDiligenceStatus.InProgress, AssignedTo = "Mark Williams", CreatedBy = "system" },
            new DueDiligence { OpportunityId = opp2.Id, Type = DueDiligenceType.Environmental, Status = DueDiligenceStatus.Pending, CreatedBy = "system" }
        );

        // ─── MODULE 2: PLANNING ───
        var plan1 = new PlanningApplication
        {
            OpportunityId = opp1.Id, ApplicationReference = "PA/2024/0156", Description = "Full planning for 100 residential units",
            LocalAuthority = "Wandsworth Borough Council", ApplicationType = "Full Planning",
            Status = PlanningApplicationStatus.ApprovedWithConditions, SubmissionDate = new DateTime(2024, 3, 15),
            ValidationDate = new DateTime(2024, 3, 22), DecisionDate = new DateTime(2024, 8, 10),
            PlanningOfficer = "James Wilson", Ward = "Wandsworth Town", SiteAddress = "45 Riverside Road, SW18",
            ApplicationFee = 462, CreatedBy = "system"
        };
        context.PlanningApplications.Add(plan1);
        context.PlanningConditions.AddRange(
            new PlanningCondition { PlanningApplicationId = plan1.Id, ConditionNumber = 1, Title = "Landscaping Scheme", Description = "Submit details of hard and soft landscaping", Status = PlanningConditionStatus.Discharged, CreatedBy = "system" },
            new PlanningCondition { PlanningApplicationId = plan1.Id, ConditionNumber = 2, Title = "Construction Management Plan", Description = "Submit CMP before works commence", Status = PlanningConditionStatus.Discharged, CreatedBy = "system" },
            new PlanningCondition { PlanningApplicationId = plan1.Id, ConditionNumber = 3, Title = "Materials Samples", Description = "Submit samples of external materials", Status = PlanningConditionStatus.Pending, DueDate = DateTime.UtcNow.AddMonths(1), CreatedBy = "system" }
        );

        // ─── MODULE 3: LEGAL ───
        context.Contracts.AddRange(
            new Contract { OpportunityId = opp1.Id, Title = "Sale & Purchase Agreement - Riverside", ContractType = ContractType.SaleAndPurchase, Status = ContractStatus.Completed, ContractReference = "CON/2024/001", CounterpartyName = "Riverside Holdings Ltd", ContractValue = 4500000, Solicitor = "Sarah Mitchell", SolicitorFirm = "Mills & Reeve LLP", ExchangeDate = new DateTime(2024, 9, 1), CompletionDate = new DateTime(2024, 10, 15), CreatedBy = "system" },
            new Contract { OpportunityId = opp2.Id, Title = "Option Agreement - Oakwood", ContractType = ContractType.OptionAgreement, Status = ContractStatus.UnderReview, ContractReference = "CON/2024/002", CounterpartyName = "Oakwood Estates", ContractValue = 3200000, Solicitor = "David Brown", SolicitorFirm = "Ashurst LLP", CreatedBy = "system" }
        );
        context.ComplianceChecks.AddRange(
            new ComplianceCheck { OpportunityId = opp1.Id, CheckType = ComplianceCheckType.AML, Status = ComplianceCheckStatus.Passed, AssignedTo = "Compliance Team", CompletedDate = new DateTime(2024, 6, 1), RiskLevel = RiskLevel.Low, CreatedBy = "system" },
            new ComplianceCheck { OpportunityId = opp1.Id, CheckType = ComplianceCheckType.TitleVerification, Status = ComplianceCheckStatus.Passed, CompletedDate = new DateTime(2024, 6, 15), RiskLevel = RiskLevel.Low, CreatedBy = "system" },
            new ComplianceCheck { OpportunityId = opp2.Id, CheckType = ComplianceCheckType.AML, Status = ComplianceCheckStatus.InProgress, AssignedTo = "Jane Cooper", CreatedBy = "system" }
        );

        // ─── MODULE 4: PROJECTS ───
        var proj1 = new Project
        {
            OpportunityId = opp1.Id, Name = "Riverside Apartments Development", ProjectReference = "PRJ/2024/001",
            Status = ProjectStatus.InProgress, ProjectManager = "Michael Chen", SiteAddress = "45 Riverside Road, SW18",
            StartDate = new DateTime(2024, 11, 1), TargetEndDate = new DateTime(2026, 6, 30),
            Budget = 41800000, ActualCost = 18500000, TotalUnits = 100, ProgressPercent = 62, CreatedBy = "system"
        };
        context.Projects.Add(proj1);

        context.Milestones.AddRange(
            new Milestone { ProjectId = proj1.Id, Title = "Foundation Complete", Status = MilestoneStatus.Completed, TargetDate = new DateTime(2025, 2, 1), CompletedDate = new DateTime(2025, 1, 28), SortOrder = 1, CreatedBy = "system" },
            new Milestone { ProjectId = proj1.Id, Title = "Structure Completion", Status = MilestoneStatus.Completed, TargetDate = new DateTime(2025, 6, 1), CompletedDate = new DateTime(2025, 6, 5), SortOrder = 2, CreatedBy = "system" },
            new Milestone { ProjectId = proj1.Id, Title = "Roofing Complete", Status = MilestoneStatus.InProgress, TargetDate = new DateTime(2025, 7, 15), SortOrder = 3, CreatedBy = "system" },
            new Milestone { ProjectId = proj1.Id, Title = "First Fix Complete", Status = MilestoneStatus.Upcoming, TargetDate = new DateTime(2025, 9, 30), SortOrder = 4, CreatedBy = "system" },
            new Milestone { ProjectId = proj1.Id, Title = "Handover Block A", Status = MilestoneStatus.Upcoming, TargetDate = new DateTime(2026, 4, 15), SortOrder = 5, CreatedBy = "system" }
        );

        context.ProjectTasks.AddRange(
            new ProjectTask { ProjectId = proj1.Id, Title = "Complete roofing Block A", Status = ProjectTaskStatus.InProgress, Priority = ProjectTaskPriority.High, AssignedTo = "Roofing Team", DueDate = new DateTime(2025, 7, 10), ProgressPercent = 85, CreatedBy = "system" },
            new ProjectTask { ProjectId = proj1.Id, Title = "Order kitchen units", Status = ProjectTaskStatus.NotStarted, Priority = ProjectTaskPriority.Medium, AssignedTo = "Procurement", DueDate = new DateTime(2025, 8, 1), CreatedBy = "system" },
            new ProjectTask { ProjectId = proj1.Id, Title = "Fire safety inspection", Status = ProjectTaskStatus.NotStarted, Priority = ProjectTaskPriority.Critical, AssignedTo = "Site Manager", DueDate = new DateTime(2025, 7, 20), CreatedBy = "system" }
        );

        context.ProjectRisks.AddRange(
            new ProjectRisk { ProjectId = proj1.Id, Title = "Material supply delays", Status = RiskStatus.Mitigating, Impact = RiskImpact.High, Probability = RiskProbability.Medium, MitigationPlan = "Maintain 2-week buffer stock. Secondary supplier identified.", Owner = "Procurement Manager", IdentifiedDate = new DateTime(2025, 3, 1), CreatedBy = "system" },
            new ProjectRisk { ProjectId = proj1.Id, Title = "Labour shortage (electricians)", Status = RiskStatus.Open, Impact = RiskImpact.Medium, Probability = RiskProbability.High, Owner = "HR / Site Manager", IdentifiedDate = new DateTime(2025, 5, 15), CreatedBy = "system" }
        );

        // ─── MODULE 5: CONSTRUCTION ───
        var stage1 = new ConstructionStage { ProjectId = proj1.Id, Name = "Substructure & Foundations", Status = ConstructionStageStatus.Completed, SortOrder = 1, PlannedStartDate = new DateTime(2024, 11, 1), PlannedEndDate = new DateTime(2025, 2, 1), ActualStartDate = new DateTime(2024, 11, 1), ActualEndDate = new DateTime(2025, 1, 28), ProgressPercent = 100, CreatedBy = "system" };
        var stage2 = new ConstructionStage { ProjectId = proj1.Id, Name = "Superstructure", Status = ConstructionStageStatus.Completed, SortOrder = 2, PlannedStartDate = new DateTime(2025, 2, 1), PlannedEndDate = new DateTime(2025, 6, 1), ActualStartDate = new DateTime(2025, 2, 3), ActualEndDate = new DateTime(2025, 6, 5), ProgressPercent = 100, CreatedBy = "system" };
        var stage3 = new ConstructionStage { ProjectId = proj1.Id, Name = "Roofing & Envelope", Status = ConstructionStageStatus.InProgress, SortOrder = 3, PlannedStartDate = new DateTime(2025, 6, 1), PlannedEndDate = new DateTime(2025, 8, 1), ActualStartDate = new DateTime(2025, 6, 6), ProgressPercent = 75, CreatedBy = "system" };
        var stage4 = new ConstructionStage { ProjectId = proj1.Id, Name = "First Fix (M&E)", Status = ConstructionStageStatus.NotStarted, SortOrder = 4, PlannedStartDate = new DateTime(2025, 8, 1), PlannedEndDate = new DateTime(2025, 10, 1), CreatedBy = "system" };
        var stage5 = new ConstructionStage { ProjectId = proj1.Id, Name = "Second Fix & Finishing", Status = ConstructionStageStatus.NotStarted, SortOrder = 5, PlannedStartDate = new DateTime(2025, 10, 1), PlannedEndDate = new DateTime(2026, 2, 1), CreatedBy = "system" };
        context.ConstructionStages.AddRange(stage1, stage2, stage3, stage4, stage5);

        context.Inspections.AddRange(
            new Inspection { ConstructionStageId = stage1.Id, Type = InspectionType.Foundation, Status = InspectionStatus.Passed, Inspector = "Building Control", ScheduledDate = new DateTime(2025, 1, 20), CompletedDate = new DateTime(2025, 1, 20), DefectsFound = 0, CreatedBy = "system" },
            new Inspection { ConstructionStageId = stage2.Id, Type = InspectionType.Structural, Status = InspectionStatus.Passed, Inspector = "Structural Engineer", ScheduledDate = new DateTime(2025, 5, 28), CompletedDate = new DateTime(2025, 5, 28), DefectsFound = 2, CreatedBy = "system" },
            new Inspection { ConstructionStageId = stage3.Id, Type = InspectionType.Roofing, Status = InspectionStatus.Scheduled, Inspector = "Roof Consultant", ScheduledDate = new DateTime(2025, 7, 25), CreatedBy = "system" }
        );

        context.Snags.AddRange(
            new Snag { ConstructionStageId = stage2.Id, Title = "Crack in stairwell wall Block B", Status = SnagStatus.Resolved, Priority = SnagPriority.High, AssignedTo = "Structural Repairs Ltd", ResolvedDate = new DateTime(2025, 6, 10), CreatedBy = "system" },
            new Snag { ConstructionStageId = stage2.Id, Title = "Uneven floor slab Level 3", Status = SnagStatus.Open, Priority = SnagPriority.Medium, AssignedTo = "Main Contractor", CreatedBy = "system" }
        );

        // ─── MODULE 6: PROCUREMENT ───
        context.PurchaseOrders.AddRange(
            new PurchaseOrder { ProjectId = proj1.Id, OrderReference = "PO/2025/001", SupplierName = "Builder's Warehouse", Status = PurchaseOrderStatus.Delivered, TotalValue = 125000, OrderDate = new DateTime(2025, 1, 10), ExpectedDeliveryDate = new DateTime(2025, 1, 25), ActualDeliveryDate = new DateTime(2025, 1, 24), Description = "Structural steel - Phase 1", CreatedBy = "system" },
            new PurchaseOrder { ProjectId = proj1.Id, OrderReference = "PO/2025/002", SupplierName = "Roofing Solutions Ltd", Status = PurchaseOrderStatus.Ordered, TotalValue = 85000, OrderDate = new DateTime(2025, 5, 20), ExpectedDeliveryDate = new DateTime(2025, 6, 15), Description = "Roof tiles and membrane", CreatedBy = "system" },
            new PurchaseOrder { ProjectId = proj1.Id, OrderReference = "PO/2025/003", SupplierName = "Electrical Wholesale", Status = PurchaseOrderStatus.Draft, TotalValue = 210000, OrderDate = new DateTime(2025, 6, 1), Description = "Full electrical package - all blocks", CreatedBy = "system" }
        );

        // ─── MODULE 7: CONTRACTORS ───
        context.Contractors.AddRange(
            new Contractor { CompanyName = "Smith Construction Ltd", Type = ContractorType.MainContractor, Status = ContractorStatus.Active, ContactName = "John Smith", Email = "john@smithconstruction.co.uk", Phone = "020 7123 4567", Trade = "General Build", Rating = 4.5m, CreatedBy = "system" },
            new Contractor { CompanyName = "Elite Electrical", Type = ContractorType.Subcontractor, Status = ContractorStatus.Preferred, ContactName = "Sarah Park", Email = "sarah@eliteelectrical.co.uk", Trade = "Electrical", Rating = 4.8m, CreatedBy = "system" },
            new Contractor { CompanyName = "PlumbPro Services", Type = ContractorType.Subcontractor, Status = ContractorStatus.Active, ContactName = "Dave Jones", Email = "dave@plumbpro.co.uk", Trade = "Plumbing & Heating", Rating = 4.2m, CreatedBy = "system" },
            new Contractor { CompanyName = "Apex Roofing", Type = ContractorType.Specialist, Status = ContractorStatus.Active, ContactName = "Mike Taylor", Email = "mike@apexroofing.co.uk", Trade = "Roofing", Rating = 4.6m, CreatedBy = "system" },
            new Contractor { CompanyName = "Builder's Warehouse", Type = ContractorType.Supplier, Status = ContractorStatus.Active, ContactName = "Trade Account", Email = "trade@builderswarehouse.co.uk", Trade = "Materials Supply", Rating = 4.0m, CreatedBy = "system" }
        );

        // ─── MODULE 8: FINANCE ───
        context.BudgetLines.AddRange(
            new BudgetLine { ProjectId = proj1.Id, Category = "Land Acquisition", PlannedAmount = 4500000, ActualAmount = 4500000, Status = BudgetLineStatus.Spent, CreatedBy = "system" },
            new BudgetLine { ProjectId = proj1.Id, Category = "Construction", PlannedAmount = 28000000, ActualAmount = 12500000, Status = BudgetLineStatus.Committed, CreatedBy = "system" },
            new BudgetLine { ProjectId = proj1.Id, Category = "Professional Fees", PlannedAmount = 3500000, ActualAmount = 1200000, Status = BudgetLineStatus.Committed, CreatedBy = "system" },
            new BudgetLine { ProjectId = proj1.Id, Category = "Marketing & Sales", PlannedAmount = 2800000, ActualAmount = 300000, Status = BudgetLineStatus.Planned, CreatedBy = "system" },
            new BudgetLine { ProjectId = proj1.Id, Category = "Contingency", PlannedAmount = 3000000, ActualAmount = 0, Status = BudgetLineStatus.Planned, CreatedBy = "system" }
        );
        context.FinancialTransactions.AddRange(
            new FinancialTransaction { ProjectId = proj1.Id, Type = TransactionType.Expense, Description = "Land purchase completion", Amount = 4500000, TransactionDate = new DateTime(2024, 10, 15), Category = "Land", Reference = "TXN/001", CreatedBy = "system" },
            new FinancialTransaction { ProjectId = proj1.Id, Type = TransactionType.Expense, Description = "Structural steel package", Amount = 125000, TransactionDate = new DateTime(2025, 1, 24), Category = "Construction", Reference = "TXN/002", CreatedBy = "system" },
            new FinancialTransaction { ProjectId = proj1.Id, Type = TransactionType.Income, Description = "Unit reservations (10 units)", Amount = 500000, TransactionDate = new DateTime(2025, 4, 1), Category = "Sales", Reference = "TXN/003", CreatedBy = "system" }
        );

        // ─── MODULE 9: INVESTORS ───
        context.Investors.AddRange(
            new Investor { Name = "Capital Growth Partners", Type = InvestorType.Institutional, ContactName = "Richard Hayes", Email = "richard@capitalgrowth.com", TotalCommitted = 15000000, TotalDeployed = 10000000, CreatedBy = "system" },
            new Investor { Name = "Thames Valley Investments", Type = InvestorType.Corporate, ContactName = "Amanda Wells", Email = "amanda@tvifund.co.uk", TotalCommitted = 8000000, TotalDeployed = 5500000, CreatedBy = "system" },
            new Investor { Name = "Robert Chen", Type = InvestorType.Individual, Email = "robert.chen@email.com", TotalCommitted = 2000000, TotalDeployed = 2000000, CreatedBy = "system" }
        );

        // ─── MODULE 10: PROPERTY UNITS ───
        for (int i = 1; i <= 20; i++)
        {
            var status = i <= 8 ? UnitStatus.Sold : i <= 12 ? UnitStatus.Reserved : i <= 15 ? UnitStatus.Available : UnitStatus.NotReleased;
            context.PropertyUnits.Add(new PropertyUnit
            {
                ProjectId = proj1.Id, UnitReference = $"RSA-{i:D3}",
                UnitType = i % 3 == 0 ? "3-Bed Apartment" : i % 2 == 0 ? "2-Bed Apartment" : "1-Bed Apartment",
                Bedrooms = i % 3 == 0 ? 3 : i % 2 == 0 ? 2 : 1,
                FloorArea = 45 + (i % 3) * 25, Price = 350000 + (i % 3) * 100000,
                Status = status, Floor = $"{(i - 1) / 4 + 1}", CreatedBy = "system"
            });
        }

        // ─── MODULE 11: SALES ───
        context.SalesLeads.AddRange(
            new SalesLead { ProjectId = proj1.Id, Name = "Emma Watson", Email = "emma.w@email.com", Phone = "07700 900001", Source = "Website", Status = LeadStatus.Reserved, InterestDetails = "2-bed apartment, Block A", Budget = 450000, CreatedBy = "system" },
            new SalesLead { ProjectId = proj1.Id, Name = "James Oliver", Email = "james.o@email.com", Source = "Agent Referral", Status = LeadStatus.ViewingCompleted, InterestDetails = "3-bed penthouse", Budget = 650000, CreatedBy = "system" },
            new SalesLead { ProjectId = proj1.Id, Name = "Sofia Martinez", Email = "sofia.m@email.com", Source = "Social Media", Status = LeadStatus.New, InterestDetails = "1-bed investment property", Budget = 350000, CreatedBy = "system" },
            new SalesLead { ProjectId = proj1.Id, Name = "David Kim", Phone = "07700 900004", Source = "Walk-in", Status = LeadStatus.Contacted, InterestDetails = "2-bed for family", Budget = 480000, CreatedBy = "system" },
            new SalesLead { ProjectId = proj1.Id, Name = "Lisa Thompson", Email = "lisa.t@email.com", Source = "Exhibition", Status = LeadStatus.ViewingBooked, InterestDetails = "Any available 2-bed", Budget = 420000, CreatedBy = "system" }
        );

        // ─── MODULE 12: RENTALS ───
        var unit1 = context.PropertyUnits.Local.First();
        context.Tenancies.Add(new Tenancy
        {
            PropertyUnitId = unit1.Id, TenantName = "Alex Turner", TenantEmail = "alex.t@email.com",
            MonthlyRent = 1800, LeaseStartDate = new DateTime(2025, 4, 1), LeaseEndDate = new DateTime(2026, 3, 31),
            Status = TenancyStatus.Active, CreatedBy = "system"
        });

        // ─── MODULE 13: DOCUMENTS ───
        context.KnowledgeDocuments.AddRange(
            new KnowledgeDocument { ProjectId = proj1.Id, Title = "Planning Decision Notice", Category = DocumentCategory.Planning, FileName = "decision-notice-PA2024-0156.pdf", FilePath = "/documents/planning/", FileSizeBytes = 2048000, Version = 1, Tags = "planning,approval,decision", UploadedBy = "System Admin", CreatedBy = "system" },
            new KnowledgeDocument { ProjectId = proj1.Id, Title = "Structural Engineering Report", Category = DocumentCategory.Construction, FileName = "structural-report-v2.pdf", FilePath = "/documents/construction/", FileSizeBytes = 5120000, Version = 2, Tags = "structural,engineering,report", UploadedBy = "System Admin", CreatedBy = "system" },
            new KnowledgeDocument { Title = "Standard Sale & Purchase Agreement Template", Category = DocumentCategory.Template, FileName = "spa-template-v3.docx", FilePath = "/documents/templates/", FileSizeBytes = 512000, Version = 3, Tags = "template,contract,legal", UploadedBy = "System Admin", CreatedBy = "system" }
        );

        // ─── MODULE 14: REPORTS ───
        context.SavedReports.AddRange(
            new SavedReport { Title = "Monthly Financial Summary", ReportType = "Financial", Description = "P&L and cash flow for current month", GeneratedBy = "Finance Director", LastGeneratedAt = DateTime.UtcNow.AddDays(-3), CreatedBy = "system" },
            new SavedReport { Title = "Sales Pipeline Report", ReportType = "Sales", Description = "Lead conversion and revenue forecast", GeneratedBy = "Sales Manager", LastGeneratedAt = DateTime.UtcNow.AddDays(-7), CreatedBy = "system" },
            new SavedReport { Title = "Construction Progress Report", ReportType = "Construction", Description = "Stage completion and milestone tracking", GeneratedBy = "Project Manager", LastGeneratedAt = DateTime.UtcNow.AddDays(-1), CreatedBy = "system" }
        );

        await context.SaveChangesAsync();
        logger.LogInformation("Demo data seeding completed. Seeded: 5 opportunities, 1 project, 20 units, 5 stages, 5 leads, 3 investors, 5 contractors.");
    }
}
