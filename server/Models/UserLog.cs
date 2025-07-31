using System;

namespace server.Models
{
    public class UserLog

    {
        public int Id { get; set; }
        public string? User_id { get; set; }
        public string? Username { get; set; }
        public string? Action { get; set; }
        public string? Action_time { get; set; }
        public string? Fullname { get; set; }
    }
}
