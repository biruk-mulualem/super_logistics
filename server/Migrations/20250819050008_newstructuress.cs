using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class newstructuress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IntransitItems");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmountPaid",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grn",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ItemDescription",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "QntyRecived",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "QntyRemaning",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Quantity",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPaidInPercent",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPrice",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "IntransitFollowups",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Uom",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grn",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "ItemDescription",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "QntyRecived",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "QntyRemaning",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "TotalPaidInPercent",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "Uom",
                table: "IntransitFollowups");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmountPaid",
                table: "IntransitFollowups",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "IntransitItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IntransitFollowupId = table.Column<int>(type: "int", nullable: false),
                    ItemDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    TotalPrice = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    UnitPrice = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    Uom = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntransitItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IntransitItems_IntransitFollowups_IntransitFollowupId",
                        column: x => x.IntransitFollowupId,
                        principalTable: "IntransitFollowups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_IntransitItems_IntransitFollowupId",
                table: "IntransitItems",
                column: "IntransitFollowupId");
        }
    }
}
