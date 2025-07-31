using System;

namespace server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? User_id { get; set; }
        public string? User_name { get; set; }
        public string? Fullname { get; set; }
        public string? Password { get; set; }
        public string? Department { get; set; }
        public string? Role { get; set; }
        public DateTime Registerd_date { get; set; }
    }
}
