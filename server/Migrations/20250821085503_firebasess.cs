using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class firebasess : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QntyRecived",
                table: "IntransitFollowups");

            migrationBuilder.DropColumn(
                name: "QntyRemaning",
                table: "IntransitFollowups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "QntyRecived",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "QntyRemaning",
                table: "IntransitFollowups",
                type: "decimal(25,3)",
                nullable: true);
        }
    }
}
