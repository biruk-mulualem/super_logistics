using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusColumnToLogistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContainerType",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LoadedOn",
                table: "Reports",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContainerType",
                table: "RecycleBins",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LoadedOn",
                table: "RecycleBins",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContainerType",
                table: "LogisticsFollowups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LoadedOn",
                table: "LogisticsFollowups",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContainerType",
                table: "Histories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LoadedOn",
                table: "Histories",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContainerType",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ContainerType",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "ContainerType",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "ContainerType",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "Histories");
        }
    }
}
