using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class newvaluesssssss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IntransitItem_IntransitFollowups_IntransitFollowupId",
                table: "IntransitItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IntransitItem",
                table: "IntransitItem");

            migrationBuilder.RenameTable(
                name: "IntransitItem",
                newName: "IntransitItems");

            migrationBuilder.RenameIndex(
                name: "IX_IntransitItem_IntransitFollowupId",
                table: "IntransitItems",
                newName: "IX_IntransitItems_IntransitFollowupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IntransitItems",
                table: "IntransitItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_IntransitItems_IntransitFollowups_IntransitFollowupId",
                table: "IntransitItems",
                column: "IntransitFollowupId",
                principalTable: "IntransitFollowups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IntransitItems_IntransitFollowups_IntransitFollowupId",
                table: "IntransitItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IntransitItems",
                table: "IntransitItems");

            migrationBuilder.RenameTable(
                name: "IntransitItems",
                newName: "IntransitItem");

            migrationBuilder.RenameIndex(
                name: "IX_IntransitItems_IntransitFollowupId",
                table: "IntransitItem",
                newName: "IX_IntransitItem_IntransitFollowupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IntransitItem",
                table: "IntransitItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_IntransitItem_IntransitFollowups_IntransitFollowupId",
                table: "IntransitItem",
                column: "IntransitFollowupId",
                principalTable: "IntransitFollowups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
