using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class newupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "LoadedOn",
                table: "Histories");

            migrationBuilder.AlterColumn<string>(
                name: "ContainerType",
                table: "Reports",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "LoadedOnfcl",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ContainerType",
                table: "RecycleBins",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "LoadedOnfcl",
                table: "RecycleBins",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ContainerType",
                table: "LogisticsFollowups",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "LoadedOnfcl",
                table: "LogisticsFollowups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ContainerType",
                table: "Histories",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "LoadedOnfcl",
                table: "Histories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoadedOnfcl",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "LoadedOnfcl",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "LoadedOnfcl",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "LoadedOnfcl",
                table: "Histories");

            migrationBuilder.AlterColumn<int>(
                name: "ContainerType",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "LoadedOn",
                table: "Reports",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ContainerType",
                table: "RecycleBins",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "LoadedOn",
                table: "RecycleBins",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ContainerType",
                table: "LogisticsFollowups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "LoadedOn",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ContainerType",
                table: "Histories",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "LoadedOn",
                table: "Histories",
                type: "date",
                nullable: true);
        }
    }
}
