using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class newupdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "BillCollected",
                table: "Reports",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocCollected",
                table: "Reports",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocOwner",
                table: "Reports",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocSentDjb",
                table: "Reports",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Etadjb",
                table: "Reports",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "TaxPaid",
                table: "Reports",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "truckWayBill",
                table: "Reports",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "BillCollected",
                table: "RecycleBins",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocCollected",
                table: "RecycleBins",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocOwner",
                table: "RecycleBins",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocSentDjb",
                table: "RecycleBins",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Etadjb",
                table: "RecycleBins",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "TaxPaid",
                table: "RecycleBins",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "truckWayBill",
                table: "RecycleBins",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "BillCollected",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocCollected",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocOwner",
                table: "LogisticsFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocSentDjb",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Etadjb",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "TaxPaid",
                table: "LogisticsFollowups",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "truckWayBill",
                table: "LogisticsFollowups",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "BillCollected",
                table: "Histories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocCollected",
                table: "Histories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocOwner",
                table: "Histories",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "DocSentDjb",
                table: "Histories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Etadjb",
                table: "Histories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "TaxPaid",
                table: "Histories",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "truckWayBill",
                table: "Histories",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillCollected",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "DocCollected",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "DocOwner",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "DocSentDjb",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "Etadjb",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "TaxPaid",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "truckWayBill",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "BillCollected",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "DocCollected",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "DocOwner",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "DocSentDjb",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "Etadjb",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "TaxPaid",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "truckWayBill",
                table: "RecycleBins");

            migrationBuilder.DropColumn(
                name: "BillCollected",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "DocCollected",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "DocOwner",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "DocSentDjb",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "Etadjb",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "TaxPaid",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "truckWayBill",
                table: "LogisticsFollowups");

            migrationBuilder.DropColumn(
                name: "BillCollected",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "DocCollected",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "DocOwner",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "DocSentDjb",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "Etadjb",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "TaxPaid",
                table: "Histories");

            migrationBuilder.DropColumn(
                name: "truckWayBill",
                table: "Histories");
        }
    }
}
