using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class logisticsstarted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemDescription",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "LoadedOnfcl",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "TotalPaidInPercent",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "Uom",
                table: "LogisticsFollowups");

            migrationBuilder.CreateTable(
                name: "logisticsItemsDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IntransitId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ItemDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<decimal>(type: "decimal(25,3)", nullable: true),
                    Uom = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LoadedQnty = table.Column<decimal>(type: "decimal(25,3)", nullable: true),
                    RemaningQnty = table.Column<decimal>(type: "decimal(25,3)", nullable: true),
                    TotalQnty = table.Column<decimal>(type: "decimal(25,3)", nullable: true),
                    Date = table.Column<DateOnly>(type: "date", nullable: true),
                    status = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_logisticsItemsDetails", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "logisticsItemsDetails");

            migrationBuilder.AddColumn<string>(
                name: "ItemDescription",
                table: "LogisticsFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "LoadedOnfcl",
                table: "LogisticsFollowups",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPaidInPercent",
                table: "LogisticsFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Uom",
                table: "LogisticsFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
