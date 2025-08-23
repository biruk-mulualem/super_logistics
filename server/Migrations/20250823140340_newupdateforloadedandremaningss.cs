using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class newupdateforloadedandremaningss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoadedQnty",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "RemaningQnty",
                table: "IntransitFollowups");

            migrationBuilder.AddColumn<decimal>(
                name: "LoadedQnty",
                table: "IntransitItemsDetails",
                type: "decimal(25,3)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RemaningQnty",
                table: "IntransitItemsDetails",
                type: "decimal(25,3)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoadedQnty",
                table: "IntransitItemsDetails");

            migrationBuilder.DropColumn(
                name: "RemaningQnty",
                table: "IntransitItemsDetails");

            migrationBuilder.AddColumn<decimal>(
                name: "LoadedQnty",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RemaningQnty",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true);
        }
    }
}
