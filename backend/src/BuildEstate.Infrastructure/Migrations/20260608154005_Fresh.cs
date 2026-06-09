using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildEstate.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Fresh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetLines_Projects_ProjectId",
                table: "BudgetLines");

            migrationBuilder.DropForeignKey(
                name: "FK_ConstructionStages_Projects_ProjectId",
                table: "ConstructionStages");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_PurchaseOrders_PurchaseOrderId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_DesignPackages_Projects_ProjectId",
                table: "DesignPackages");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_LandOpportunities_OpportunityId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_DueDiligences_LandOpportunities_OpportunityId",
                table: "DueDiligences");

            migrationBuilder.DropForeignKey(
                name: "FK_FinancialTransactions_Projects_ProjectId",
                table: "FinancialTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Inspections_ConstructionStages_ConstructionStageId",
                table: "Inspections");

            migrationBuilder.DropForeignKey(
                name: "FK_Milestones_Projects_ProjectId",
                table: "Milestones");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_LandOpportunities_OpportunityId",
                table: "Offers");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningAppeals_PlanningApplications_PlanningApplicationId",
                table: "PlanningAppeals");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningConditions_PlanningApplications_PlanningApplicationId",
                table: "PlanningConditions");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningDocuments_PlanningApplications_PlanningApplicationId",
                table: "PlanningDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectRisks_Projects_ProjectId",
                table: "ProjectRisks");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyUnits_Projects_ProjectId",
                table: "PropertyUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Snags_ConstructionStages_ConstructionStageId",
                table: "Snags");

            migrationBuilder.DropForeignKey(
                name: "FK_Tenancies_PropertyUnits_PropertyUnitId",
                table: "Tenancies");

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetLines_Projects_ProjectId",
                table: "BudgetLines",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ConstructionStages_Projects_ProjectId",
                table: "ConstructionStages",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_PurchaseOrders_PurchaseOrderId",
                table: "Deliveries",
                column: "PurchaseOrderId",
                principalTable: "PurchaseOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DesignPackages_Projects_ProjectId",
                table: "DesignPackages",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_LandOpportunities_OpportunityId",
                table: "Documents",
                column: "OpportunityId",
                principalTable: "LandOpportunities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DueDiligences_LandOpportunities_OpportunityId",
                table: "DueDiligences",
                column: "OpportunityId",
                principalTable: "LandOpportunities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FinancialTransactions_Projects_ProjectId",
                table: "FinancialTransactions",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Inspections_ConstructionStages_ConstructionStageId",
                table: "Inspections",
                column: "ConstructionStageId",
                principalTable: "ConstructionStages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Milestones_Projects_ProjectId",
                table: "Milestones",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_LandOpportunities_OpportunityId",
                table: "Offers",
                column: "OpportunityId",
                principalTable: "LandOpportunities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningAppeals_PlanningApplications_PlanningApplicationId",
                table: "PlanningAppeals",
                column: "PlanningApplicationId",
                principalTable: "PlanningApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningConditions_PlanningApplications_PlanningApplicationId",
                table: "PlanningConditions",
                column: "PlanningApplicationId",
                principalTable: "PlanningApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningDocuments_PlanningApplications_PlanningApplicationId",
                table: "PlanningDocuments",
                column: "PlanningApplicationId",
                principalTable: "PlanningApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectRisks_Projects_ProjectId",
                table: "ProjectRisks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyUnits_Projects_ProjectId",
                table: "PropertyUnits",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Snags_ConstructionStages_ConstructionStageId",
                table: "Snags",
                column: "ConstructionStageId",
                principalTable: "ConstructionStages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tenancies_PropertyUnits_PropertyUnitId",
                table: "Tenancies",
                column: "PropertyUnitId",
                principalTable: "PropertyUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetLines_Projects_ProjectId",
                table: "BudgetLines");

            migrationBuilder.DropForeignKey(
                name: "FK_ConstructionStages_Projects_ProjectId",
                table: "ConstructionStages");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_PurchaseOrders_PurchaseOrderId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_DesignPackages_Projects_ProjectId",
                table: "DesignPackages");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_LandOpportunities_OpportunityId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_DueDiligences_LandOpportunities_OpportunityId",
                table: "DueDiligences");

            migrationBuilder.DropForeignKey(
                name: "FK_FinancialTransactions_Projects_ProjectId",
                table: "FinancialTransactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Inspections_ConstructionStages_ConstructionStageId",
                table: "Inspections");

            migrationBuilder.DropForeignKey(
                name: "FK_Milestones_Projects_ProjectId",
                table: "Milestones");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_LandOpportunities_OpportunityId",
                table: "Offers");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningAppeals_PlanningApplications_PlanningApplicationId",
                table: "PlanningAppeals");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningConditions_PlanningApplications_PlanningApplicationId",
                table: "PlanningConditions");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanningDocuments_PlanningApplications_PlanningApplicationId",
                table: "PlanningDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectRisks_Projects_ProjectId",
                table: "ProjectRisks");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyUnits_Projects_ProjectId",
                table: "PropertyUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Snags_ConstructionStages_ConstructionStageId",
                table: "Snags");

            migrationBuilder.DropForeignKey(
                name: "FK_Tenancies_PropertyUnits_PropertyUnitId",
                table: "Tenancies");

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetLines_Projects_ProjectId",
                table: "BudgetLines",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ConstructionStages_Projects_ProjectId",
                table: "ConstructionStages",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_PurchaseOrders_PurchaseOrderId",
                table: "Deliveries",
                column: "PurchaseOrderId",
                principalTable: "PurchaseOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DesignPackages_Projects_ProjectId",
                table: "DesignPackages",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_LandOpportunities_OpportunityId",
                table: "Documents",
                column: "OpportunityId",
                principalTable: "LandOpportunities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DueDiligences_LandOpportunities_OpportunityId",
                table: "DueDiligences",
                column: "OpportunityId",
                principalTable: "LandOpportunities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FinancialTransactions_Projects_ProjectId",
                table: "FinancialTransactions",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Inspections_ConstructionStages_ConstructionStageId",
                table: "Inspections",
                column: "ConstructionStageId",
                principalTable: "ConstructionStages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Milestones_Projects_ProjectId",
                table: "Milestones",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_LandOpportunities_OpportunityId",
                table: "Offers",
                column: "OpportunityId",
                principalTable: "LandOpportunities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningAppeals_PlanningApplications_PlanningApplicationId",
                table: "PlanningAppeals",
                column: "PlanningApplicationId",
                principalTable: "PlanningApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningConditions_PlanningApplications_PlanningApplicationId",
                table: "PlanningConditions",
                column: "PlanningApplicationId",
                principalTable: "PlanningApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanningDocuments_PlanningApplications_PlanningApplicationId",
                table: "PlanningDocuments",
                column: "PlanningApplicationId",
                principalTable: "PlanningApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectRisks_Projects_ProjectId",
                table: "ProjectRisks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyUnits_Projects_ProjectId",
                table: "PropertyUnits",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Snags_ConstructionStages_ConstructionStageId",
                table: "Snags",
                column: "ConstructionStageId",
                principalTable: "ConstructionStages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tenancies_PropertyUnits_PropertyUnitId",
                table: "Tenancies",
                column: "PropertyUnitId",
                principalTable: "PropertyUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
