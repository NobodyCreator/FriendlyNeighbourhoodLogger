using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FriendlyNeighbourhoodLogger.Migrations
{
    /// <inheritdoc />
    public partial class AddIGDBFieldsToMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "Media",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Media",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Genres",
                table: "Media",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "Media");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Media");

            migrationBuilder.DropColumn(
                name: "Genres",
                table: "Media");
        }
    }
}
