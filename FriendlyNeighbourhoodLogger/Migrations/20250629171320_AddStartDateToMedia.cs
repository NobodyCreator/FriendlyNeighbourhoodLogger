using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FriendlyNeighbourhoodLogger.Migrations
{
    /// <inheritdoc />
    public partial class AddStartDateToMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateStarted",
                table: "Media",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateStarted",
                table: "Media");
        }
    }
}
