using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FriendlyNeighbourhoodLogger.Migrations
{
    /// <inheritdoc />
    public partial class AdjustRequiredFieldsInMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MetadataId",
                table: "Media",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UnifiedMediaMetadata",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ExternalMediaId = table.Column<int>(type: "INTEGER", nullable: false),
                    DataSource = table.Column<string>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CoverImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Genres = table.Column<string>(type: "TEXT", nullable: true),
                    LastFetched = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnifiedMediaMetadata", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Media_MetadataId",
                table: "Media",
                column: "MetadataId");

            migrationBuilder.AddForeignKey(
                name: "FK_Media_UnifiedMediaMetadata_MetadataId",
                table: "Media",
                column: "MetadataId",
                principalTable: "UnifiedMediaMetadata",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Media_UnifiedMediaMetadata_MetadataId",
                table: "Media");

            migrationBuilder.DropTable(
                name: "UnifiedMediaMetadata");

            migrationBuilder.DropIndex(
                name: "IX_Media_MetadataId",
                table: "Media");

            migrationBuilder.DropColumn(
                name: "MetadataId",
                table: "Media");
        }
    }
}
