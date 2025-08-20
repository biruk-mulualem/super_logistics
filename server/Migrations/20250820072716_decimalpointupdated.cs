using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class decimalpointupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalPrice",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalPaidInPercent",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmountPaid",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "QntyRemaning",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "QntyRecived",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,2)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalPrice",
                table: "IntransitFollowups",
                type: "decimal(25,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalPaidInPercent",
                table: "IntransitFollowups",
                type: "decimal(25,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmountPaid",
                table: "IntransitFollowups",
                type: "decimal(25,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "QntyRemaning",
                table: "IntransitFollowups",
                type: "decimal(25,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "QntyRecived",
                table: "IntransitFollowups",
                type: "decimal(25,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)",
                oldNullable: true);
        }
    }
}
