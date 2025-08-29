using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class officedbupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AkkArrived",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "DjbDeparted",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "EmpityContainersLeftUnreturned",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "SdtArrived",
                table: "LogisticsFollowups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "AkkArrived",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DjbDeparted",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmpityContainersLeftUnreturned",
                table: "LogisticsFollowups",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "SdtArrived",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);
        }
    }
}
