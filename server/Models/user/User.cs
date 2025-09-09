using System;
namespace server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? UserId { get; set; }       // renamed to PascalCase
        public string? Username { get; set; }
        public string? Fullname { get; set; }
        public string? Password { get; set; } // store hashed password here
        public string? Department { get; set; }
        public string? Role { get; set; }
        public DateOnly? RegisteredDate { get; set; } // fixed typo
    }
}
