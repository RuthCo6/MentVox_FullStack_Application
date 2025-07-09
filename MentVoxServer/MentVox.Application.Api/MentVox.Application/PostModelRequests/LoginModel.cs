using System.ComponentModel.DataAnnotations;

namespace MentVox_Application.Api.Models
{
    public class LoginModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public string? Email { get; set; }
    }

    public class RegisterModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }

        public string? FullName { get; set; }
        public string? Phone { get; set; }
    }
}