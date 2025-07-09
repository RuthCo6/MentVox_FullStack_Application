using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using MentVox.Data;
using Microsoft.EntityFrameworkCore;
using System; // עבור Exception ו־DateTime
using System.Collections.Generic; // עבור List<Claim>

public class JwtTokenGenerator
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public JwtTokenGenerator(IConfiguration configuration, ApplicationDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    public string GenerateToken(string username)
    {
        var user = _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role) // ✅ טוען גם את שם התפקיד עצמו
            .FirstOrDefault(u => u.UserName == username);

        if (user == null)
            throw new Exception("User not found");

        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, username),
        };

        // ✅ הוספת roles מתוך user.UserRoles
        foreach (var userRole in user.UserRoles)
        {
            if (!string.IsNullOrWhiteSpace(userRole?.Role?.RoleName))
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole.Role.RoleName));
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}