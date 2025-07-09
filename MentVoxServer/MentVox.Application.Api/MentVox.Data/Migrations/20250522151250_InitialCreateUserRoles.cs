using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentVox.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateUserRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_UserRoles_UserRoleUserId_UserRoleRoleId",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_UserRoleUserId_UserRoleRoleId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "UserRoleRoleId",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "UserRoleUserId",
                table: "UserRoles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserRoleRoleId",
                table: "UserRoles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserRoleUserId",
                table: "UserRoles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserRoleUserId_UserRoleRoleId",
                table: "UserRoles",
                columns: new[] { "UserRoleUserId", "UserRoleRoleId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_UserRoles_UserRoleUserId_UserRoleRoleId",
                table: "UserRoles",
                columns: new[] { "UserRoleUserId", "UserRoleRoleId" },
                principalTable: "UserRoles",
                principalColumns: new[] { "UserId", "RoleId" });
        }
    }
}
