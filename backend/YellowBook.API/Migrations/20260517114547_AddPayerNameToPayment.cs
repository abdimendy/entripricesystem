using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YellowBook.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPayerNameToPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PayerName",
                table: "Payments",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PayerName", table: "Payments");
        }
    }
}
