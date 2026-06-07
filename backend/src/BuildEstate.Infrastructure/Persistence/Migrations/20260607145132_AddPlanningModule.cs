using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuildEstate.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPlanningModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "RefreshTokens",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Offers",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "LandOwners",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "LandOpportunities",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "LandAcquisitions",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "DueDiligences",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Documents",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateTable(
                name: "PlanningApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OpportunityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    LocalAuthority = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ApplicationType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SubmissionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValidationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DecisionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DecisionNotice = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    PlanningOfficer = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CaseOfficerEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Ward = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SiteAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ApplicationFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanningApplications_LandOpportunities_OpportunityId",
                        column: x => x.OpportunityId,
                        principalTable: "LandOpportunities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PlanningAppeals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanningApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppealReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AppealDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HearingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DecisionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Inspector = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Grounds = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Decision = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningAppeals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanningAppeals_PlanningApplications_PlanningApplicationId",
                        column: x => x.PlanningApplicationId,
                        principalTable: "PlanningApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlanningConditions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanningApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConditionNumber = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DischargeDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DischargeReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AssignedTo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningConditions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanningConditions_PlanningApplications_PlanningApplicationId",
                        column: x => x.PlanningApplicationId,
                        principalTable: "PlanningApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlanningDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanningApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanningDocuments_PlanningApplications_PlanningApplicationId",
                        column: x => x.PlanningApplicationId,
                        principalTable: "PlanningApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlanningAppeals_AppealReference",
                table: "PlanningAppeals",
                column: "AppealReference",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanningAppeals_PlanningApplicationId",
                table: "PlanningAppeals",
                column: "PlanningApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningAppeals_Status",
                table: "PlanningAppeals",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningApplications_ApplicationReference",
                table: "PlanningApplications",
                column: "ApplicationReference",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanningApplications_CreatedAt",
                table: "PlanningApplications",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningApplications_LocalAuthority",
                table: "PlanningApplications",
                column: "LocalAuthority");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningApplications_OpportunityId",
                table: "PlanningApplications",
                column: "OpportunityId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningApplications_Status",
                table: "PlanningApplications",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningApplications_Status_CreatedAt",
                table: "PlanningApplications",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PlanningConditions_PlanningApplicationId",
                table: "PlanningConditions",
                column: "PlanningApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningConditions_PlanningApplicationId_ConditionNumber",
                table: "PlanningConditions",
                columns: new[] { "PlanningApplicationId", "ConditionNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanningConditions_Status",
                table: "PlanningConditions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningDocuments_DocumentType",
                table: "PlanningDocuments",
                column: "DocumentType");

            migrationBuilder.CreateIndex(
                name: "IX_PlanningDocuments_PlanningApplicationId",
                table: "PlanningDocuments",
                column: "PlanningApplicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlanningAppeals");

            migrationBuilder.DropTable(
                name: "PlanningConditions");

            migrationBuilder.DropTable(
                name: "PlanningDocuments");

            migrationBuilder.DropTable(
                name: "PlanningApplications");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "RefreshTokens");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "LandOwners");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "LandOpportunities");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "LandAcquisitions");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "DueDiligences");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Documents");
        }
    }
}
