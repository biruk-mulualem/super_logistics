using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class RenameNumberOfContainersReturned : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "numberofContReturned",
                table: "Reports",
                newName: "EmpityContainersLeftUnreturned");

            migrationBuilder.RenameColumn(
                name: "numberofContReturned",
                table: "RecycleBins",
                newName: "EmpityContainersLeftUnreturned");

            migrationBuilder.RenameColumn(
                name: "numberofContReturned",
                table: "LogisticsFollowups",
                newName: "EmpityContainersLeftUnreturned");

            migrationBuilder.RenameColumn(
                name: "numberofContReturned",
                table: "Histories",
                newName: "EmpityContainersLeftUnreturned");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EmpityContainersLeftUnreturned",
                table: "Reports",
                newName: "numberofContReturned");

            migrationBuilder.RenameColumn(
                name: "EmpityContainersLeftUnreturned",
                table: "RecycleBins",
                newName: "numberofContReturned");

            migrationBuilder.RenameColumn(
                name: "EmpityContainersLeftUnreturned",
                table: "LogisticsFollowups",
                newName: "numberofContReturned");

            migrationBuilder.RenameColumn(
                name: "EmpityContainersLeftUnreturned",
                table: "Histories",
                newName: "numberofContReturned");
        }
    }
}
