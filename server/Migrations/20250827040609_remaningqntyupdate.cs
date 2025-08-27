using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class remaningqntyupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "RemaningQnty",
                table: "IntransitItemsDetails",
                type: "decimal(25,3)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "RemaningQnty",
                table: "IntransitItemsDetails",
                type: "decimal(25,3)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,3)");
        }
    }
}
