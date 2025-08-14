using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnToLogisticscontainerretur : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContReturned",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "ContReturned",
                table: "Histories");

            migrationBuilder.RenameColumn(
                name: "ContReturned",
                table: "LogisticsFollowups",
                newName: "numberofContReturned");

            migrationBuilder.AddColumn<int>(
                name: "numberofContReturned",
                table: "RecycleBins",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "numberofContReturned",
                table: "Histories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "numberofContReturned",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "numberofContReturned",
                table: "Histories");

            migrationBuilder.RenameColumn(
                name: "numberofContReturned",
                table: "LogisticsFollowups",
                newName: "ContReturned");

            migrationBuilder.AddColumn<bool>(
                name: "ContReturned",
                table: "RecycleBins",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ContReturned",
                table: "Histories",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
