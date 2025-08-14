using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusColumnToLogisticscontainer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContReturned",
                table: "Reports");

            migrationBuilder.AddColumn<int>(
                name: "numberofContReturned",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "numberofContReturned",
                table: "Reports");

            migrationBuilder.AddColumn<bool>(
                name: "ContReturned",
                table: "Reports",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
