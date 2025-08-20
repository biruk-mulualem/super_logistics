using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class paymenttermupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentHistorys",
                table: "PaymentHistorys");

            migrationBuilder.RenameTable(
                name: "PaymentHistorys",
                newName: "PaymentHistories");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentHistories",
                table: "PaymentHistories",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentHistories",
                table: "PaymentHistories");

            migrationBuilder.RenameTable(
                name: "PaymentHistories",
                newName: "PaymentHistorys");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentHistorys",
                table: "PaymentHistorys",
                column: "Id");
        }
    }
}
