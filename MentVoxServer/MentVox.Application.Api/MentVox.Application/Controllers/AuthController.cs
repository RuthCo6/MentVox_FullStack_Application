using MentVox.Core.Models;
using MentVox.Data;
using MentVox_Application.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly JwtTokenGenerator _jwtTokenGenerator;
    private readonly ApplicationDbContext _context;
    public AuthController(JwtTokenGenerator jwtTokenGenerator, ApplicationDbContext context)
    {
        _jwtTokenGenerator = jwtTokenGenerator;
        _context = context;
    }

    //[HttpPost("login")]
    //public IActionResult Login([FromBody] LoginModel model)
    //{
    //    //כאן אפשר לשים לוגיקה אמיתית לבדוק את המשתמש בסיסמה
    //    if (model.UserName == "rcMentVox" && model.Password == "654321")
    //    {
    //        var token = _jwtTokenGenerator.GenerateToken(model.UserName);
    //        return Ok(new { Token = token });
    //    }
    //    return Unauthorized();
    //}

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var user = _context.Users
                .FirstOrDefault(u => u.UserName == model.UserName);

            if (user == null)
                return Unauthorized("User not found");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
            if (!isPasswordValid)
                return Unauthorized("Invalid password");

            var token = _jwtTokenGenerator.GenerateToken(user.UserName);

            return Ok(new
            {
                Token = token,
                UserName = user.UserName
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }



    [Authorize(Roles = "Admin")]
    [HttpGet("all-users")]
    public IActionResult GetAllUsers()
    {
        var users = _context.Users.ToList();
        return Ok(users);
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (_context.Users.Any(u => u.UserName == model.UserName))
            return BadRequest("Username already exists");

        if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6)
            return BadRequest("Password must be at least 6 characters long");

        var defaultRole = _context.Roles.FirstOrDefault(r => r.RoleName == "User");

        if (defaultRole == null)
        {
            defaultRole = new Role
            {
                RoleName = "User",
                Description = "Default role for new users",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            _context.Roles.Add(defaultRole);
            _context.SaveChanges();
        }

        try
        {
            var users = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine("🔥 ERROR: " + ex.Message);
            throw;
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

        var newUser = new User
        {
            UserName = model.UserName,
            Password = hashedPassword,
            Email = model.Email,
            UserRoles = new List<UserRole>
         {
             new UserRole { RoleId = defaultRole.Id }
         }
        };

        _context.Users.Add(newUser);
        _context.SaveChanges();

        var token = _jwtTokenGenerator.GenerateToken(newUser.UserName);

        return Ok(new
        {
            message = "User registered successfully",
            token = token,
            username = newUser.UserName,
            email = newUser.Email
        });
    }
}
