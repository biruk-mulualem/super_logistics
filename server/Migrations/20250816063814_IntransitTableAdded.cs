using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class IntransitTableAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "IntransitFollowups",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "IntransitFollowups",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<string>(
                name: "ContactPerson",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Grn",
                table: "IntransitFollowups",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaidFrom",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PurchaseCompany",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PurchaseDate",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "QntyRecived",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "QntyRemaning",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TotalAmountPaid",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "TotalPaidInPercent",
                table: "IntransitFollowups",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalPrice",
                table: "IntransitFollowups",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitPrice",
                table: "IntransitFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactPerson",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "Grn",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "PaidFrom",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "PurchaseCompany",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "PurchaseDate",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "QntyRecived",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "QntyRemaning",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "Remark",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "TotalAmountPaid",
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

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "IntransitFollowups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "IntransitFollowups",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
