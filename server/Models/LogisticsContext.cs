using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    public class LogisticsContext : DbContext
    {
        public LogisticsContext(DbContextOptions<LogisticsContext> options) : base(options) { }

        public DbSet<LogisticsFollowup> LogisticsFollowups { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<UserLog> UserLogs { get; set; }
        public DbSet<User> Users { get; set; }
         public DbSet<RecycleBin> RecycleBins { get; set; }


    }
}


