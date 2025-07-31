using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    public class LogisticsContext : DbContext
    {
        public LogisticsContext(DbContextOptions<LogisticsContext> options) : base(options) { }

        public DbSet<LogisticsItem> LogisticsItems { get; set; }
    }
}
