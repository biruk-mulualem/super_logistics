using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class remaningcolumnadeded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmountRemaning",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalRemaningInPercent",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalAmountRemaning",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "TotalRemaningInPercent",
                table: "IntransitFollowups");
        }
    }
}
